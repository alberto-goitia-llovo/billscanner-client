import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetReaderComponent } from './sheet-reader.component';

describe('SheetReaderComponent', () => {
  let component: SheetReaderComponent;
  let fixture: ComponentFixture<SheetReaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetReaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
