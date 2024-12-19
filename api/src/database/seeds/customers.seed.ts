import { DataSource } from 'typeorm';
import { Customer } from '../../customers/entities';

export async function seedCustomers(dataSource: DataSource): Promise<void> {
  const customerRepository = dataSource.getRepository(Customer);

  const customers = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      address: '123 Main Street, Springfield',
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      address: '456 Elm Street, Metropolis',
    },
  ];

  for (const customer of customers) {
    const existingCustomer = await customerRepository.findOneBy({
      email: customer.email,
    });
    if (!existingCustomer) {
      const newCustomer = customerRepository.create(customer);
      await customerRepository.save(newCustomer);
      console.log(`Seeded customer: ${customer.name}`);
    }
  }
}
