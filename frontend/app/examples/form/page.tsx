import React from 'react';
import { FormExample } from '../../components/examples/form-example';

export default function FormExamplePage() {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Form Components Example</h1>
          <p className="text-muted-foreground">
            A demonstration of our custom UI components working together to create a form
          </p>
        </div>

        <div className="mt-10">
          <FormExample />
        </div>
      </div>
    </div>
  );
}
