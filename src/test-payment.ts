import db from './models';

async function testPayment() {
    try {
        console.log("--- Starting Payment Verification Test ---");

        // 1. Find a test user
        const user = await db.User.findOne();
        if (!user) {
            console.log("No users found. Creating one...");
            const newUser = await db.User.create({ username: 'testuser', email: 'test@example.com', role: 'admin' });
            console.log(`Created user: ${newUser.username} (ID: ${newUser.id})`);
            return;
        }
        console.log(`Found user: ${user.username} (ID: ${user.id})`);

        // 2. Find a test plan
        const plan = await db.Plan.findOne({ where: { name: 'Pro' } });
        if (!plan) {
            console.log("Pro plan not found. Please run seeders first.");
            return;
        }
        console.log(`Found plan: ${plan.name} (ID: ${plan.id})`);

        // 3. Simulate Subscription Upgrade
        console.log("Simulating Subscription Upgrade...");
        // Deactivate old ones
        await db.Subscription.update({ status: 'inactive' }, { where: { UserId: user.id } });
        
        const sub = await db.Subscription.create({
            UserId: user.id,
            PlanId: plan.id,
            status: 'active',
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            paymentIntentId: 'test_gpay_transaction_123'
        });
        console.log("Subscription created successfully:", sub.id);

        // 4. Find a test product
        const product = await db.DigitalProduct.findOne();
        if (!product) {
            console.log("No digital products found. Creating one...");
            const newProduct = await db.DigitalProduct.create({
                UserId: user.id,
                name: "Test eBook",
                description: "A great digital guide",
                price: 19.99,
                fileUrl: "https://example.com/download.pdf"
            });
            console.log("Product created:", newProduct.name);
        }

        const targetProduct = await db.DigitalProduct.findOne();
        console.log(`Found product: ${targetProduct.name} (ID: ${targetProduct.id})`);

        // 5. Simulate Order Placement
        console.log("Simulating Digital Product Order...");
        const order = await db.Order.create({
            UserId: user.id,
            DigitalProductId: targetProduct.id,
            status: 'completed',
            paymentIntentId: 'test_gpay_order_456'
        });
        console.log("Order created successfully:", order.id);

        console.log("--- Payment Verification Test Completed Successfully ---");
        process.exit(0);
    } catch (error) {
        console.error("Test failed:", error);
        process.exit(1);
    }
}

testPayment();
