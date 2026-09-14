import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopSeccion } from './top-seccion';

describe('TopSeccion', () => {
  let component: TopSeccion;
  let fixture: ComponentFixture<TopSeccion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopSeccion],
    }).compileComponents();

    fixture = TestBed.createComponent(TopSeccion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
