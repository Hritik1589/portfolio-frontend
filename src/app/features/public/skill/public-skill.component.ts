import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicSkillService } from '../../../core/services/public-skill.service';
import { SkillResponse, SkillCategory } from '../../../core/models/skill.model';

@Component({
  selector: 'app-public-skill',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-skill.component.html',
  styleUrl: './public-skill.component.scss'
})
export class PublicSkillComponent implements OnInit {
  private readonly skillService = inject(PublicSkillService);

  public skills = signal<SkillResponse[]>([]);
  public isLoading = signal<boolean>(true);
  public errorMessage = signal<string | null>(null);
  public selectedCategory = signal<string>('ALL');

  public categories = ['ALL', ...Object.values(SkillCategory)];

  public filteredSkills = computed(() => {
    const currentCat = this.selectedCategory();
    const allSkills = this.skills();
    if (currentCat === 'ALL') {
      return allSkills;
    }
    return allSkills.filter(s => s.category === currentCat);
  });

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.skillService.getAllSkills().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.skills.set(res.data);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load public skills', err);
        this.errorMessage.set('Unable to load technical stack at this time.');
        this.isLoading.set(false);
      }
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  formatCategoryName(cat: string): string {
    if (cat === 'ALL') return 'All Tech';
    return cat.replace('_', ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
  }
}