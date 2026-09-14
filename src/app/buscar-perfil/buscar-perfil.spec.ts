import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscarPerfil } from './buscar-perfil';

describe('BuscarPerfil', () => {
  let component: BuscarPerfil;
  let fixture: ComponentFixture<BuscarPerfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarPerfil],
    }).compileComponents();

    fixture = TestBed.createComponent(BuscarPerfil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
