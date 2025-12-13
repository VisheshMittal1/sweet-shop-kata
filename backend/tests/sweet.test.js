const Sweet = require('../src/models/Sweet');

describe('Sweet Model TDD', () => {
  test('should create a sweet - RED', async () => {
    const result = await Sweet.create({
      name: 'Lollipop',
      category: 'Candy',
      price: 10,
      quantity: 50
    });
    expect(result.name).toBe('Lollipop');
    expect(result.price).toBe(10);
  });

  test('should list all sweets', async () => {
    const sweets = await Sweet.findAll();
    expect(Array.isArray(sweets)).toBe(true);
  });
});
