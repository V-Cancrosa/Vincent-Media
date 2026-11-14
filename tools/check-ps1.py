#!/usr/bin/env python3
"""Sprawdza skrypty PowerShell przed commitem:
- pliki .ps1 uruchamiane z dysku (-File) z polskimi znakami muszą mieć BOM UTF-8
  (Windows PowerShell 5.1 czyta je inaczej jako ANSI i np. półpauza psuje składnię),
- install.ps1 (uruchamiany przez irm | iex) nie może mieć BOM,
- żaden .ps1 nie może mieć typograficznych cudzysłowów (PowerShell traktuje je jak zwykły cudzysłów),
- nawiasy klamrowe i okrągłe muszą się bilansować.
Użycie: python3 tools/check-ps1.py   (kod wyjścia 1 = problem)
"""
import pathlib
import sys

root = pathlib.Path(__file__).resolve().parent.parent
QUOTES = '„”“'
bad = []
for p in sorted(root.rglob('*.ps1')):
    if '.git' in p.parts:
        continue
    b = p.read_bytes()
    rel = p.relative_to(root)
    has_bom = b.startswith(b'\xef\xbb\xbf')
    t = b.decode('utf-8-sig')
    if rel.name == 'install.ps1':
        if has_bom:
            bad.append(f'{rel}: nie może mieć BOM (irm | iex)')
    elif any(ord(c) > 127 for c in t) and not has_bom:
        bad.append(f'{rel}: brak BOM UTF-8 przy znakach spoza ASCII')
    if any(c in t for c in QUOTES):
        bad.append(f'{rel}: typograficzne cudzysłowy')
    if t.count('{') != t.count('}') or t.count('(') != t.count(')'):
        bad.append(f'{rel}: niezbilansowane nawiasy')
print('\n'.join(bad) or 'ps1: OK')
sys.exit(1 if bad else 0)
