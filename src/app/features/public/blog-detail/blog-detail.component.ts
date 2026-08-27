import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PublicBlogService } from '../../../core/services/public-blog.service';
import { BlogResponse } from '../../../core/models/blog.model';
import { Location } from '@angular/common';
@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss'
})
export class BlogDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly blogService = inject(PublicBlogService);
  private readonly location = inject(Location);

  // State Signals
  blog = signal<BlogResponse | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.fetchBlog(slug);
    } else {
      this.isLoading.set(false);
      this.errorMessage.set('Invalid article URL.');
    }
  }
  goBack(): void {
    this.location.back();
  }

  fetchBlog(slug: string): void {
    this.isLoading.set(true);
    
    this.blogService.getBlogBySlug(slug).subscribe({
      next: (res: any) => {
        this.blog.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load blog reader view:', err);
        // FIX: Use .set() to update the signal value instead of reassigning it
        this.errorMessage.set('Article not found or unavailable.');
        this.blog.set(null); // Ensure blog is null on error so the fallback UI shows
        this.isLoading.set(false);
      }
    });
  }
}