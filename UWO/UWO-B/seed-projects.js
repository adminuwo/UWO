require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Fix Jio DNS SRV issue
const mongoose = require('mongoose');
const Project = require('./models/Project');

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const count = await Project.countDocuments({ deleted_at: null });
    if (count > 0) {
        console.log(`ℹ️ Projects already exist (${count} found). Deleting and re-seeding with 6 Flagship Projects...`);
        await Project.deleteMany({});
    }

    const projects = [
        {
            name: 'AISA',
            logo: '/uploads/aisa-logo.svg',
            short_description: "UWO™'s immersive AI Super Assistant designed to unify your entire digital world into a single cohesive, intelligent platform.",
            project_url: '/aisa',
            button_label: 'Explore AISA',
            display_order: 1,
            is_featured: true,
            status: 'active'
        },
        {
            name: 'AI Mall',
            logo: '/uploads/aimall-logo.webp',
            short_description: "UWO™'s flagship AI platform built to enable the deployment, orchestration, and global distribution of AI agents at scale. Launching with the first 100 AI applications as the foundation of its global ecosystem.",
            project_url: 'https://aimall24.com/',
            button_label: 'Visit AI Mall',
            display_order: 2,
            is_featured: true,
            status: 'active'
        },
        {
            name: 'AI LEGAL',
            logo: '/uploads/ailegallogo.png',
            short_description: 'Autonomous legal intelligence platform engineered for contract drafting, compliance auditing, litigation research, and automated risk analysis.',
            project_url: '/ai-legal',
            button_label: 'Explore AI LEGAL',
            display_order: 3,
            is_featured: true,
            status: 'active'
        },
        {
            name: 'UWO Connect',
            logo: '/uploads/uwoconnectlogo.png',
            short_description: 'Unified AI-powered enterprise communication & customer interaction platform connecting CRM, support, and omnichannel workflows.',
            project_url: '/projects/uwo-connect',
            button_label: 'Explore UWO Connect',
            display_order: 4,
            is_featured: true,
            status: 'active'
        },
        {
            name: 'AI ADS',
            logo: '/uploads/aiads-logo.png',
            short_description: 'Autonomous Content Intelligence & 8K Creative Studio for brand-aligned ad creatives, automated multi-channel campaigns, and marketing ROI.',
            project_url: '/ai-ads',
            button_label: 'Explore AI ADS',
            display_order: 5,
            is_featured: true,
            status: 'active'
        },
        {
            name: 'AI-Education',
            logo: '/uploads/ai-education-logo.jpg',
            short_description: 'Unified Enterprise Digital Campus & AI Collaboration Operating System tailored for K-12 Schools, Colleges, and Universities.',
            project_url: '/ai-education',
            button_label: 'Visit AI-Education',
            display_order: 6,
            is_featured: true,
            status: 'active'
        },
        {
            name: 'EFV',
            logo: '/uploads/efv-logo.png',
            short_description: 'A research-driven intelligence framework exploring the intersection of cognitive science, frequency systems, and AI.',
            project_url: '/efv',
            button_label: 'Explore EFV',
            display_order: 7,
            is_featured: true,
            status: 'active'
        }
    ];

    await Project.insertMany(projects);
    console.log('✅ All 7 flagship projects seeded successfully into MongoDB!');
    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
});
