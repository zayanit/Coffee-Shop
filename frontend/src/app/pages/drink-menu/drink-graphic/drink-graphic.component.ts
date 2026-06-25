import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Drink } from 'src/app/services/drinks.service';

// Matches valid CSS color values: named colors, hex, rgb/rgba, hsl/hsla
const SAFE_COLOR_RE = /^(#[0-9a-fA-F]{3,8}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)|hsl\(\s*\d+\s*,\s*[\d.]+%\s*,\s*[\d.]+%\s*\)|hsla\(\s*\d+\s*,\s*[\d.]+%\s*,\s*[\d.]+%\s*,\s*[\d.]+\s*\)|[a-zA-Z]+)$/;

@Component({
  selector: 'app-drink-graphic',
  templateUrl: './drink-graphic.component.html',
  styleUrls: ['./drink-graphic.component.scss'],
})
export class DrinkGraphicComponent implements OnInit {
  @Input() drink: Drink;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {}

  safeColor(color: string): SafeStyle {
    if (SAFE_COLOR_RE.test((color || '').trim())) {
      return this.sanitizer.bypassSecurityTrustStyle(color);
    }
    return 'transparent';
  }

}
