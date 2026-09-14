import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArtistaDetalle } from './artista-detalle';

describe('ArtistaDetalle', () => {
  let component: ArtistaDetalle;
  let fixture: ComponentFixture<ArtistaDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistaDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtistaDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
