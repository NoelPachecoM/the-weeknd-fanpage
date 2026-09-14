import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExplosionPasado } from './explosion-pasado';

describe('ExplosionPasado', () => {
  let component: ExplosionPasado;
  let fixture: ComponentFixture<ExplosionPasado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplosionPasado],
    }).compileComponents();

    fixture = TestBed.createComponent(ExplosionPasado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
