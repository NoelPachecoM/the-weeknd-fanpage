import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilDetalle } from './perfil-detalle';

describe('PerfilDetalle', () => {
  let component: PerfilDetalle;
  let fixture: ComponentFixture<PerfilDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
