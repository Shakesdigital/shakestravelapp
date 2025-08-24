'use client';

import React, { useState } from 'react';
import { useSettings } from './SettingsContext';

const PaymentSettings: React.FC = () => {
  const { state, setState } = useSettings();
  const [local, setLocal] = useState(state.payment || { gateway: 'stripe', stripeKey: '', commissionPercent: 10, currency: 'UGX' });

  const save = () => {
    setState({ ...state, payment: local });
    alert('Payment settings saved (localStorage).');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Payment Gateway</label>
        <select value={local.gateway} onChange={e => setLocal({ ...local, gateway: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded">
          <option value="stripe">Stripe</option>
          <option value="paypal">PayPal</option>
          <option value="manual">Manual</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">API Key / Public Key</label>
        <input value={local.stripeKey} onChange={e => setLocal({ ...local, stripeKey: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Commission Percent</label>
          <input type="number" value={local.commissionPercent} onChange={e => setLocal({ ...local, commissionPercent: Number(e.target.value) })} className="mt-1 w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Default Currency</label>
          <input value={local.currency} onChange={e => setLocal({ ...local, currency: e.target.value })} className="mt-1 w-full px-3 py-2 border rounded" />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button onClick={save} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
        <button onClick={() => setLocal(state.payment || {})} className="px-4 py-2 border rounded">Reset</button>
      </div>
    </div>
  );
};

export default PaymentSettings;
