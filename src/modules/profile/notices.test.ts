import notices from '../../../assets/data/notices.generated.json';
import pkg from '../../../package.json';

it('bundles notices for direct runtime dependencies and the vendored font/map assets', () => {
  const names = new Set(notices.notices.map((entry) => entry.name));
  for (const name of Object.keys(pkg.dependencies)) expect(names.has(name)).toBe(true);
  for (const name of ['Poppins', 'Muscle map path data', 'lucide-react-native', '@expo-google-fonts/material-symbols']) {
    const entry = notices.notices.find((notice) => notice.name === name)!;
    expect(entry.texts.length).toBeGreaterThan(0);
    expect(entry.texts.every((index) => !!notices.texts[index])).toBe(true);
  }
  expect(notices.texts.join('\n')).toContain('Copyright 2020 The Poppins Project Authors');
  expect(notices.texts.join('\n')).toContain('Copyright (c) 2022 ELABBASSI Hicham');
  expect(notices.texts.join('\n')).toContain('Apache License');
});
