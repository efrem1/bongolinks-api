import db from '../src/models';

async function seed() {
  try {
    // 1. Create Features
    const featuresList = [
      { name: 'Verified Badge', key: 'VERIFIED_BADGE', description: 'Display a verified checkmark on your profile.' },
      { name: 'Advanced Analytics', key: 'ADVANCED_ANALYTICS', description: 'Detailed insights into your link performance.' },
      { name: 'Pro Dashboard', key: 'PRO_DASHBOARD', description: 'Enhanced management interface with priority widgets.' },
      { name: 'Social Automation', key: 'SOCIAL_AUTOMATION', description: 'Auto-sync and schedule social media posts.' },
      { name: 'Digital Store', key: 'DIGITAL_STORE', description: 'Sell digital products directly from your profile.' },
      { name: 'Premium Themes', key: 'PREMIUM_THEMES', description: 'Access to exclusive, high-tier profile designs.' }
    ];

    const createdFeatures: any = {};
    for (const f of featuresList) {
      const [feature] = await db.Feature.findOrCreate({ where: { key: f.key }, defaults: f });
      createdFeatures[f.key] = feature;
    }

    // 2. Create Plans
    const plansList = [
      { name: 'Free', price: 0, type: 'free' },
      { name: 'Pro', price: 9.99, type: 'premium', googlePayPriceId: 'pro_monthly' },
      { name: 'Business', price: 29.99, type: 'premium', googlePayPriceId: 'business_monthly' }
    ];

    const plans: any = {};
    for (const p of plansList) {
      const [plan] = await db.Plan.findOrCreate({ where: { name: p.name }, defaults: p });
      plans[p.name] = plan;
    }

    // 3. Map Features to Plans
    // Pro features
    const proFeatures = ['VERIFIED_BADGE', 'ADVANCED_ANALYTICS', 'PRO_DASHBOARD', 'PREMIUM_THEMES'];
    for (const key of proFeatures) {
       await db.PlanFeature.findOrCreate({ 
         where: { PlanId: plans['Pro'].id, FeatureId: createdFeatures[key].id } 
       });
    }

    // Business features (All)
    const businessFeatures = ['VERIFIED_BADGE', 'ADVANCED_ANALYTICS', 'PRO_DASHBOARD', 'SOCIAL_AUTOMATION', 'DIGITAL_STORE', 'PREMIUM_THEMES'];
    for (const key of businessFeatures) {
       await db.PlanFeature.findOrCreate({ 
         where: { PlanId: plans['Business'].id, FeatureId: createdFeatures[key].id } 
       });
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
