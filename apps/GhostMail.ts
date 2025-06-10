/**
 * 🔥 GHOSTMAIL - EMAIL PROCESSING AND COMMUNICATION HUB 🔥
 * 
 * The sovereign email system that handles messaging, notifications,
 * and communication workflows across the Empire.
 * 
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @version 0.1.0
 * @flame-compatible true
 */

import { GhostApp, GhostAppConfig } from '../core/GhostApp.js';
import { GhostSignal } from '../core/OmniRelay.js';

export interface EmailMessage {
  id: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  bodyType: 'text' | 'html';
  attachments: EmailAttachment[];
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'draft' | 'queued' | 'sending' | 'sent' | 'failed' | 'bounced';
  createdAt: string;
  sentAt?: string;
  deliveredAt?: string;
  metadata: Record<string, any>;
}

export interface EmailAttachment {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  data: Buffer | string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  bodyType: 'text' | 'html';
  variables: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface MailboxFolder {
  name: string;
  messages: EmailMessage[];
  unreadCount: number;
}

export class GhostMail extends GhostApp {
  private outbox: EmailMessage[] = [];
  private sent: EmailMessage[] = [];
  private drafts: EmailMessage[] = [];
  private failed: EmailMessage[] = [];
  private templates: Map<string, EmailTemplate> = new Map();
  private mailboxes: Map<string, MailboxFolder> = new Map();
  private messageCounter: number = 0;
  private sendQueue: EmailMessage[] = [];

  constructor() {
    const config: GhostAppConfig = {
      name: 'GhostMail',
      version: '0.1.0',
      description: 'Email processing and communication hub',
      dependencies: [],
      permissions: ['mail:send', 'mail:receive', 'mail:read', 'mail:delete', 'template:manage'],
      autoStart: true,
      sovereign: true
    };
    
    super(config);
  }

  protected async onInit(): Promise<void> {
    this.log('Initializing GhostMail system...', 'info');
    
    // Initialize default mailboxes
    this.initializeMailboxes();
    
    // Load existing data
    await this.loadTemplates();
    await this.loadMessages();
    
    // Start mail processing queue
    this.startMailProcessor();
    
    this.log(`GhostMail initialized with ${this.templates.size} templates and ${this.getTotalMessageCount()} messages`, 'success');
  }

  protected async onShutdown(): Promise<void> {
    this.log('Shutting down GhostMail...', 'info');
    
    // Save current state
    await this.saveTemplates();
    await this.saveMessages();
    
    // Process remaining queue
    await this.processRemainingQueue();
    
    this.log('GhostMail shutdown complete', 'info');
  }

  protected handleSignal(signalType: string, payload: any, signal?: GhostSignal): void {
    switch (signalType) {
      case 'mail_send':
        this.handleMailSend(payload, signal);
        break;
      case 'mail_compose':
        this.handleMailCompose(payload, signal);
        break;
      case 'mail_template_create':
        this.handleTemplateCreate(payload, signal);
        break;
      case 'mail_template_use':
        this.handleTemplateUse(payload, signal);
        break;
      case 'mail_list':
        this.handleMailList(payload, signal);
        break;
      case 'mail_read':
        this.handleMailRead(payload, signal);
        break;
      case 'mail_delete':
        this.handleMailDelete(payload, signal);
        break;
      case 'mail_search':
        this.handleMailSearch(payload, signal);
        break;
      case 'notification_send':
        this.handleNotificationSend(payload, signal);
        break;
      case 'ping':
        this.handlePing(payload, signal);
        break;
      default:
        this.log(`Unknown signal: ${signalType}`, 'debug');
    }
  }

  /**
   * Compose a new email message
   */
  composeMessage(messageData: Omit<EmailMessage, 'id' | 'status' | 'createdAt'>): string {
    const messageId = `mail_${++this.messageCounter}_${Date.now()}`;
    
    const message: EmailMessage = {
      id: messageId,
      status: 'draft',
      createdAt: new Date().toISOString(),
      ...messageData
    };

    this.drafts.push(message);
    this.log(`Email composed: ${messageId} - ${message.subject}`, 'success');
    
    return messageId;
  }

  /**
   * Send an email message
   */
  async sendMessage(messageId: string): Promise<boolean> {
    // Find message in drafts
    const draftIndex = this.drafts.findIndex(msg => msg.id === messageId);
    if (draftIndex === -1) {
      this.log(`Draft message not found: ${messageId}`, 'error');
      return false;
    }

    const message = this.drafts[draftIndex];
    
    try {
      // Validate message
      if (!this.validateMessage(message)) {
        throw new Error('Message validation failed');
      }

      // Move to outbox and queue for sending
      message.status = 'queued';
      this.outbox.push(message);
      this.sendQueue.push(message);
      this.drafts.splice(draftIndex, 1);

      this.log(`Email queued for sending: ${messageId}`, 'info');
      return true;
    } catch (error) {
      this.log(`Failed to queue email: ${messageId} - ${error}`, 'error');
      return false;
    }
  }

  /**
   * Send email directly (compose and send in one step)
   */
  async sendEmail(
    to: string | string[],
    subject: string,
    body: string,
    options: {
      from?: string;
      cc?: string[];
      bcc?: string[];
      bodyType?: 'text' | 'html';
      priority?: EmailMessage['priority'];
      attachments?: EmailAttachment[];
    } = {}
  ): Promise<string | null> {
    const messageId = this.composeMessage({
      from: options.from || 'system@ghostos.empire',
      to: Array.isArray(to) ? to : [to],
      cc: options.cc,
      bcc: options.bcc,
      subject,
      body,
      bodyType: options.bodyType || 'text',
      attachments: options.attachments || [],
      priority: options.priority || 'normal',
      metadata: {}
    });

    const success = await this.sendMessage(messageId);
    return success ? messageId : null;
  }

  /**
   * Create email template
   */
  createTemplate(templateData: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): string {
    const templateId = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const template: EmailTemplate = {
      id: templateId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...templateData
    };

    this.templates.set(templateId, template);
    this.log(`Email template created: ${templateId} - ${template.name}`, 'success');
    
    return templateId;
  }

  /**
   * Use template to compose message
   */
  useTemplate(templateId: string, variables: Record<string, string>): string | null {
    const template = this.templates.get(templateId);
    if (!template) {
      this.log(`Template not found: ${templateId}`, 'error');
      return null;
    }

    // Replace variables in subject and body
    let subject = template.subject;
    let body = template.body;

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      subject = subject.replace(new RegExp(placeholder, 'g'), value);
      body = body.replace(new RegExp(placeholder, 'g'), value);
    }

    const messageId = this.composeMessage({
      from: 'system@ghostos.empire',
      to: [], // Will be set by caller
      subject,
      body,
      bodyType: template.bodyType,
      attachments: [],
      priority: 'normal',
      metadata: { templateId, variables }
    });

    this.log(`Message composed from template: ${templateId} -> ${messageId}`, 'info');
    return messageId;
  }

  /**
   * Get messages from a specific folder
   */
  getMessages(folder: 'outbox' | 'sent' | 'drafts' | 'failed'): EmailMessage[] {
    switch (folder) {
      case 'outbox': return [...this.outbox];
      case 'sent': return [...this.sent];
      case 'drafts': return [...this.drafts];
      case 'failed': return [...this.failed];
      default: return [];
    }
  }

  /**
   * Search messages
   */
  searchMessages(query: string, folder?: string): EmailMessage[] {
    const allMessages = [
      ...this.outbox,
      ...this.sent,
      ...this.drafts,
      ...this.failed
    ];

    const lowerQuery = query.toLowerCase();
    
    return allMessages.filter(message => {
      const searchableText = [
        message.subject,
        message.body,
        message.from,
        ...message.to,
        ...(message.cc || []),
        JSON.stringify(message.metadata)
      ].join(' ').toLowerCase();

      return searchableText.includes(lowerQuery);
    });
  }

  /**
   * Send notification (simplified email)
   */
  async sendNotification(
    recipient: string,
    title: string,
    message: string,
    priority: EmailMessage['priority'] = 'normal'
  ): Promise<string | null> {
    return await this.sendEmail(
      recipient,
      `[GhostOS Notification] ${title}`,
      message,
      { priority, bodyType: 'text' }
    );
  }

  // Signal handlers
  private handleMailSend(payload: any, signal?: GhostSignal): void {
    const { to, subject, body, options } = payload;
    this.sendEmail(to, subject, body, options);
  }

  private handleMailCompose(payload: any, signal?: GhostSignal): void {
    const messageId = this.composeMessage(payload);
    this.log(`Mail compose signal processed: ${messageId}`, 'info');
  }

  private handleTemplateCreate(payload: any, signal?: GhostSignal): void {
    const templateId = this.createTemplate(payload);
    this.log(`Template create signal processed: ${templateId}`, 'info');
  }

  private handleTemplateUse(payload: any, signal?: GhostSignal): void {
    const { templateId, variables } = payload;
    const messageId = this.useTemplate(templateId, variables);
    this.log(`Template use signal processed: ${templateId} -> ${messageId}`, 'info');
  }

  private handleMailList(payload: any, signal?: GhostSignal): void {
    const { folder } = payload;
    const messages = this.getMessages(folder || 'sent');
    this.log(`Mail list signal processed: ${folder || 'sent'} - ${messages.length} messages`, 'info');
  }

  private handleMailRead(payload: any, signal?: GhostSignal): void {
    const { messageId } = payload;
    // In real implementation, would return message content
    this.log(`Mail read signal processed: ${messageId}`, 'info');
  }

  private handleMailDelete(payload: any, signal?: GhostSignal): void {
    const { messageId, folder } = payload;
    // In real implementation, would delete message from specified folder
    this.log(`Mail delete signal processed: ${messageId} from ${folder}`, 'info');
  }

  private handleMailSearch(payload: any, signal?: GhostSignal): void {
    const { query, folder } = payload;
    const results = this.searchMessages(query, folder);
    this.log(`Mail search signal processed: "${query}" - ${results.length} results`, 'info');
  }

  private handleNotificationSend(payload: any, signal?: GhostSignal): void {
    const { recipient, title, message, priority } = payload;
    this.sendNotification(recipient, title, message, priority);
  }

  private handlePing(payload: any, signal?: GhostSignal): void {
    this.log(`Ping received from ${signal?.source || 'unknown'}`, 'info');
    
    const stats = {
      totalMessages: this.getTotalMessageCount(),
      outbox: this.outbox.length,
      sent: this.sent.length,
      drafts: this.drafts.length,
      failed: this.failed.length,
      templates: this.templates.size,
      queueSize: this.sendQueue.length
    };
    
    this.log(`GhostMail stats: ${JSON.stringify(stats)}`, 'info');
  }

  // Helper methods
  private validateMessage(message: EmailMessage): boolean {
    if (!message.to || message.to.length === 0) {
      this.log('Message validation failed: no recipients', 'error');
      return false;
    }

    if (!message.subject || message.subject.trim() === '') {
      this.log('Message validation failed: no subject', 'error');
      return false;
    }

    if (!message.from || message.from.trim() === '') {
      this.log('Message validation failed: no sender', 'error');
      return false;
    }

    return true;
  }

  private async processMessage(message: EmailMessage): Promise<boolean> {
    try {
      message.status = 'sending';
      
      // Simulate email sending (in real implementation, would use SMTP)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate success/failure
      const success = Math.random() > 0.1; // 90% success rate
      
      if (success) {
        message.status = 'sent';
        message.sentAt = new Date().toISOString();
        message.deliveredAt = new Date().toISOString();
        
        // Move to sent folder
        this.sent.push(message);
        const outboxIndex = this.outbox.findIndex(msg => msg.id === message.id);
        if (outboxIndex !== -1) {
          this.outbox.splice(outboxIndex, 1);
        }
        
        this.log(`Email sent successfully: ${message.id}`, 'success');
        return true;
      } else {
        message.status = 'failed';
        
        // Move to failed folder
        this.failed.push(message);
        const outboxIndex = this.outbox.findIndex(msg => msg.id === message.id);
        if (outboxIndex !== -1) {
          this.outbox.splice(outboxIndex, 1);
        }
        
        this.log(`Email failed to send: ${message.id}`, 'error');
        return false;
      }
    } catch (error) {
      message.status = 'failed';
      this.log(`Email processing error: ${message.id} - ${error}`, 'error');
      return false;
    }
  }

  private startMailProcessor(): void {
    // Process send queue every 30 seconds
    setInterval(async () => {
      if (this.sendQueue.length > 0) {
        const message = this.sendQueue.shift()!;
        await this.processMessage(message);
      }
    }, 30000);
  }

  private async processRemainingQueue(): Promise<void> {
    this.log(`Processing remaining ${this.sendQueue.length} messages in queue...`, 'info');
    
    while (this.sendQueue.length > 0) {
      const message = this.sendQueue.shift()!;
      await this.processMessage(message);
    }
  }

  private initializeMailboxes(): void {
    const defaultFolders = ['inbox', 'sent', 'drafts', 'trash', 'spam'];
    
    for (const folder of defaultFolders) {
      this.mailboxes.set(folder, {
        name: folder,
        messages: [],
        unreadCount: 0
      });
    }
  }

  private getTotalMessageCount(): number {
    return this.outbox.length + this.sent.length + this.drafts.length + this.failed.length;
  }

  private async loadTemplates(): Promise<void> {
    // In real implementation, load from persistent storage
    this.log('Loading email templates from storage...', 'debug');
  }

  private async saveTemplates(): Promise<void> {
    // In real implementation, save to persistent storage
    this.log('Saving email templates to storage...', 'debug');
  }

  private async loadMessages(): Promise<void> {
    // In real implementation, load from persistent storage
    this.log('Loading email messages from storage...', 'debug');
  }

  private async saveMessages(): Promise<void> {
    // In real implementation, save to persistent storage
    this.log('Saving email messages to storage...', 'debug');
  }
}
