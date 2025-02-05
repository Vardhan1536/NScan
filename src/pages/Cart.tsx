import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import type { CartItem } from '../types';

export const Cart: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Organic Quinoa Bowl',
      price: 12.99,
      calories: 450,
      protein: 15,
      carbs: 65,
      fat: 12,
      quantity: 1
    }
  ]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-2xl font-bold mb-6">My Cart</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  Calories: {item.calories} | Protein: {item.protein}g | Carbs: {item.carbs}g | Fat: {item.fat}g
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    className="p-1 rounded-md hover:bg-gray-100"
                    onClick={() => setItems(prev =>
                      prev.map(i => i.id === item.id ? { ...i, quantity: Math.max(0, i.quantity - 1) } : i)
                    )}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="p-1 rounded-md hover:bg-gray-100"
                    onClick={() => setItems(prev =>
                      prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
                    )}
                  >
                    +
                  </button>
                </div>
                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Including all taxes</p>
        </div>
        <Button>Checkout</Button>
      </Card>
    </div>
  );
};