// src/app/features/admin/admin-messages/admin-messages.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminContactService } from '../../../core/services/admin-contact.service';
import { ContactMessageResponse } from '../../../core/models/contact-message.model';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-messages.component.html',
  styleUrl: './admin-messages.component.scss'
})
export class AdminMessagesComponent implements OnInit {
  private readonly contactService = inject(AdminContactService);

  public messages = signal<ContactMessageResponse[]>([]);
  public unreadCount = signal<number>(0);
  public isLoading = signal<boolean>(true);
  public activeTab = signal<'all' | 'unread'>('all');
  public searchQuery = signal<string>('');

  // Modal / Drawer state
  public selectedMessage = signal<ContactMessageResponse | null>(null);
  public isModalOpen = signal<boolean>(false);

  ngOnInit(): void {
    this.loadData();
  }

  public loadData(): void {
    this.fetchMessages();
    this.fetchUnreadCount();
  }

  public fetchMessages(): void {
    this.isLoading.set(true);
    const search = this.searchQuery();
    
    const request$ = this.activeTab() === 'unread' 
      ? this.contactService.getUnreadMessages() 
      : this.contactService.getAllMessages(search);

    request$.subscribe({
      next: (res: any) => {
        const pageData = res.data || res;
        const items = pageData.content || pageData || [];
        this.messages.set(items);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load contact messages', err);
        this.isLoading.set(false);
      }
    });
  }

  public fetchUnreadCount(): void {
    this.contactService.getUnreadCount().subscribe({
      next: (res: any) => {
        const count = res.data !== undefined ? res.data : res;
        this.unreadCount.set(count);
      },
      error: (err) => console.error('Failed to fetch unread count', err)
    });
  }

  public setTab(tab: 'all' | 'unread'): void {
    this.activeTab.set(tab);
    this.fetchMessages();
  }

  public onSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.fetchMessages();
  }

  public openMessage(msg: ContactMessageResponse): void {
    this.selectedMessage.set(msg);
    this.isModalOpen.set(true);

    // Automatically trigger markAsRead patch call if unread
    if (!msg.isRead) {
      this.contactService.markAsRead(msg.id).subscribe({
        next: () => {
          this.messages.update(list => 
            list.map(m => m.id === msg.id ? { ...m, isRead: true } : m)
          );
          this.fetchUnreadCount();
        },
        error: (err) => console.error('Failed to mark message as read', err)
      });
    }
  }

  public closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedMessage.set(null);
  }

  public deleteMessage(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this message?')) {
      this.contactService.deleteMessage(id).subscribe({
        next: () => {
          this.messages.update(list => list.filter(m => m.id !== id));
          this.fetchUnreadCount();
          if (this.selectedMessage()?.id === id) {
            this.closeModal();
          }
        },
        error: (err) => console.error('Failed to delete message', err)
      });
    }
  }
}