// src/app/features/public/blogs/public-blogs.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PublicBlogService } from '../../../core/services/public-blog.service';
import { BlogResponse } from '../../../core/models/blog.model';

@Component({
  selector: 'app-public-blogs',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './public-blogs.component.html',
  styleUrl: './public-blogs.component.scss'
})
export class PublicBlogsComponent implements OnInit {
  private readonly blogService = inject(PublicBlogService);

  blogs = signal<BlogResponse[]>([]);
  isLoading = signal(true);
  searchQuery = signal('');
  selectedCategory = signal('');

  categories = ['All', 'Backend', 'Frontend', 'DevOps', 'System Design', 'Architecture'];

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.isLoading.set(true);
    const categoryFilter = this.selectedCategory() === 'All' ? '' : this.selectedCategory();
    
    this.blogService.getPublishedBlogs(this.searchQuery(), categoryFilter).subscribe({
      next: (res: any) => {
        this.blogs.set(res.data?.content || res.data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading public blogs', err);
        this.isLoading.set(false);
      }
    });
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.loadBlogs();
  }

  filterByCategory(category: string): void {
    this.selectedCategory.set(category);
    this.loadBlogs();
  }

  // 3D Tilt Effect on Cards
  cardMove(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 12;
    const rotateX = ((rect.height / 2 - y) / rect.height) * 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.01)`;
  }

  leaveCard(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)`;
  }
}