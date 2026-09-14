import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlbumDetalle } from './album-detalle';

describe('AlbumDetalle', () => {
  let component: AlbumDetalle;
  let fixture: ComponentFixture<AlbumDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(AlbumDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
