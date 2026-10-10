import { evaluate, evaluateAll, parseOverrides } from './evaluate';
import { DEFAULT_FLAGS, FLAG_KEYS, FLAGS, isFlagKey } from './registry';

describe('evaluate', () => {
  it.each([
    [true, false, false, true],
    [false, true, true, false],
    [undefined, true, false, true],
    [undefined, false, true, false],
    [undefined, undefined, true, true],
    [undefined, undefined, false, false],
  ] as const)(
    'override %s, remote %s, default %s → %s',
    (override, remote, defaultValue, expected) => {
      expect(evaluate(override, remote, defaultValue)).toBe(expected);
    },
  );

  it('evaluates every flag: override, then Remote Config, then the default', () => {
    expect(
      evaluateAll(
        { smartInspection: false },
        { smartInspection: true, interviewAssistant: true },
      ),
    ).toEqual({
      smartInspection: false,
      interviewAssistant: true,
      aiDiagnostics: false,
    });
    expect(evaluateAll({}, {})).toEqual(DEFAULT_FLAGS);
  });
});

describe('registry (mirror of @quadev/flags)', () => {
  it('has the backend flags, all off by default', () => {
    expect([...FLAG_KEYS].sort()).toEqual([
      'aiDiagnostics',
      'interviewAssistant',
      'smartInspection',
    ]);
    for (const key of FLAG_KEYS) {
      expect(FLAGS[key].default).toBe(false);
      expect(DEFAULT_FLAGS[key]).toBe(false);
    }
  });

  it('recognises flag keys only', () => {
    expect(isFlagKey('smartInspection')).toBe(true);
    expect(isFlagKey('toString')).toBe(false);
    expect(isFlagKey('updatedAt')).toBe(false);
  });
});

describe('parseOverrides', () => {
  it('keeps known boolean flags and drops metadata, unknown keys and other types', () => {
    expect(
      parseOverrides({
        smartInspection: true,
        aiDiagnostics: 'yes',
        unknownFlag: true,
        updatedBy: 'admin',
        updatedAt: 1,
      }),
    ).toEqual({ smartInspection: true });
  });

  it.each([undefined, null, 'x', 42])('returns no overrides for %j', data => {
    expect(parseOverrides(data)).toEqual({});
  });
});
