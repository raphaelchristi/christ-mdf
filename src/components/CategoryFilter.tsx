import { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const categories = [
  { value: 'todas', label: 'Todas' },
  { value: 'mesas', label: 'Mesas' },
  { value: 'paineis', label: 'Painéis' },
  { value: 'cenarios', label: 'Cenários' },
  { value: 'conjuntos', label: 'Conjuntos' },
  { value: 'pecas', label: 'Peças Decorativas' },
];

export default function CategoryFilter() {
  const [active, setActive] = useState('todas');

  function handleFilter(category: string) {
    setActive(category);
    document.dispatchEvent(
      new CustomEvent('category-filter', { detail: { category } })
    );
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {categories.map(cat => (
        <motion.button
          key={cat.value}
          onClick={() => handleFilter(cat.value)}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'px-5 py-2 rounded-full text-sm font-medium transition-colors',
            active === cat.value
              ? 'bg-sage text-white'
              : 'bg-white text-dark-light hover:bg-sage-light/30'
          )}
        >
          {cat.label}
        </motion.button>
      ))}
    </div>
  );
}
