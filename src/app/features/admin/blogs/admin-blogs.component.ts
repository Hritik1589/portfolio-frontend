// src/app/features/admin/blogs/admin-blogs.component.ts
import { Component, OnInit, inject, signal, computed } from '@angular/core'; // 🚨 ADDED computed HERE
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminBlogService } from '../../../core/services/admin-blog.service';
import { BlogRequest, BlogResponse } from '../../../core/models/blog.model';

@Component({
  selector: 'app-admin-blogs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-blogs.component.html',
  styleUrl: './admin-blogs.component.scss'
})
export class AdminBlogsComponent implements OnInit {
  private readonly blogService = inject(AdminBlogService);
  private readonly fb = inject(FormBuilder);

  blogs = signal<BlogResponse[]>([]);
  isLoading = signal(true);
  isSubmitting = signal(false);

  isModalOpen = signal(false);
  editingBlogId = signal<number | null>(null);

  // 🚨 ADDED THESE TWO LINES TO FIX YOUR HTML ERROR!
  publishedCount = computed(() => this.blogs().filter(b => b.status === 'PUBLISHED').length);
  draftCount = computed(() => this.blogs().filter(b => b.status !== 'PUBLISHED').length);

  // 🚨 FIXED: Updated form controls to match backend and HTML (coverImage & category)
  blogForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    slug: ['', Validators.required],
    category: ['', Validators.required],    // Replaced excerpt
    content: ['', Validators.required],
    coverImage: ['', Validators.required],  // Replaced imageUrl
    tags: ['']
  });

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.isLoading.set(true);
    this.blogService.getAllBlogs().subscribe({
      next: (res: any) => {
        this.blogs.set(res.data?.content || res.data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load blogs', err);
        this.isLoading.set(false);
      }
    });
  }

  openModal(blog?: BlogResponse): void {
    this.isModalOpen.set(true);
    if (blog) {
      this.editingBlogId.set(blog.id);
      
      // Safe parsing for tags (avoids the [object Object] issue)
      let tagString = '';
      if (Array.isArray(blog.tags)) {
        tagString = blog.tags.map((t: any) => t.name ? t.name : t).join(', ');
      } else if (typeof blog.tags === 'string') {
        tagString = blog.tags;
      }

      // 🚨 FIXED: Explicitly map the new fields when editing so the form populates correctly
      this.blogForm.patchValue({
        title: blog.title || '',
        slug: blog.slug || '',
        category: blog.category || '',
        content: blog.content || '',
        coverImage: blog.coverImage || '',
        tags: tagString
      });
    } else {
      this.editingBlogId.set(null);
      this.blogForm.reset();
    }
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.blogForm.reset();
    this.editingBlogId.set(null);
  }

  onSubmit(): void {
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      alert("Please fill out all required fields.");
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.blogForm.getRawValue();
    const { tags, ...rest } = formValue;

    // Bulletproof array conversion
    let tagArray: string[] = [];
    if (typeof tags === 'string') {
      tagArray = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
    }

    const request: BlogRequest = {
      ...rest,
      tags: tagArray
    };

    const editId = this.editingBlogId();
    if (editId) {
      this.blogService.updateBlog(editId, request).subscribe({
        next: () => this.handleSuccess('Blog updated!'),
        error: (err) => this.handleError(err)
      });
    } else {
      this.blogService.createBlog(request).subscribe({
        next: () => this.handleSuccess('Blog created!'),
        error: (err) => this.handleError(err)
      });
    }
  }

  togglePublish(blog: BlogResponse): void {
   const action = blog.status === 'PUBLISHED' ? this.blogService.unpublishBlog(blog.id) : this.blogService.publishBlog(blog.id);
    
    action.subscribe({
      next: () => {
        this.loadBlogs();
      },
      error: (err) => alert(`Error changing status: ${err.message}`)
    });
  }

  deleteBlog(id: number): void {
    if (confirm('Are you sure you want to delete this blog post?')) {
      this.blogService.deleteBlog(id).subscribe({
        next: () => {
          this.loadBlogs();
          alert('Blog deleted successfully');
        },
        error: (err) => alert(`Delete Error: ${err.message}`)
      });
    }
  }

  private handleSuccess(message: string): void {
    this.loadBlogs();
    this.closeModal();
    this.isSubmitting.set(false);
    alert(message);
  }

  private handleError(err: any): void {
    console.error(err);
    this.isSubmitting.set(false);
    alert(`Error: ${err.error?.message || err.message}`);
  }
}