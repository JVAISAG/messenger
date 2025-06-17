import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { z } from 'zod';

import { Input } from '@/components/ui/input';
import { HTMLInputTypeAttribute } from 'react';

export default function Component({ ...props }) {
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700">{props.Label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type={props.type}
              placeholder={props.placeholder}
              className="focus-visible:ring-blue-500"
            />
          </FormControl>
          <FormDescription className="text-xs text-gray-500">
            {props.Desc}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
