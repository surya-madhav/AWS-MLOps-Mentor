'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  BookOpen,
  Code,
  Layout,
  Brain,
  CheckCircle2,
  ChevronDown,
  Database,
  BarChart,
  Server,
  Zap,
  Github,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}

interface TechBadgeProps {
  label: string;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  variants: any; // TODO: Define proper motion variants type
}

interface ArchitectureLayerProps {
  title: string;
  icon: React.ReactNode;
  items: string[];
}

interface SchemaTableProps {
  name: string;
  fields: {
    name: string;
    type: string;
    isPrimary?: boolean;
    isForeign?: boolean;
  }[];
}

interface CertificationDomainProps {
  icon: React.ReactNode;
  title: string;
  percentage: number;
  description: string;
  topics: string[];
  variants: any; // TODO: Define proper motion variants type
}

interface MotionVariants {
  hidden: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
  };
  visible: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
    transition?: {
      duration?: number;
      delay?: number;
      type?: string;
      stiffness?: number;
      staggerChildren?: number;
    };
  };
  hover?: {
    y?: number;
    scale?: number;
    boxShadow?: string;
    backgroundColor?: string;
    transition?: {
      duration?: number;
    };
  };
}

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Handle scroll events for animations
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Determine active section for scroll animations
      const scrollPosition = window.scrollY + 300;

      document.querySelectorAll('section[id]').forEach((section: any) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        type: 'spring',
        stiffness: 100,
      },
    },
    hover: {
      y: -10,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f5f0]">
      {/* Floating Navigation */}
      <motion.nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#f8f5f0]/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex justify-between items-center px-4">
          <motion.div
            className="font-bold text-[#5c4033] text-xl"
            whileHover={{ scale: 1.05 }}
          >
            AWS MLOps Academy
          </motion.div>
          <div className="hidden md:flex space-x-6">
            <NavLink href="#features" isActive={activeSection === 'features'}>
              Features
            </NavLink>
            <NavLink
              href="#architecture"
              isActive={activeSection === 'architecture'}
            >
              Architecture
            </NavLink>
            <NavLink
              href="#certification"
              isActive={activeSection === 'certification'}
            >
              Certification
            </NavLink>
            <NavLink href="#tech" isActive={activeSection === 'tech'}>
              Tech Stack
            </NavLink>
          </div>
          <motion.div className="flex items-center gap-3">
            <motion.a
              href="https://github.com/yourusername/aws-mlops-learning-platform"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5c4033] hover:text-[#8b5a2b] transition-colors"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Github className="size-5" />
              <span className="sr-only">GitHub</span>
            </motion.a>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                asChild
                className="bg-[#8b5a2b] hover:bg-[#6b4423] text-white"
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="flex flex-col items-center justify-center pt-32 pb-24 px-4 text-center relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#8b5a2b]/20 to-transparent"></div>
          <div className="grid grid-cols-10 size-full">
            {Array.from({ length: 100 }).map((_, i) => (
              <motion.div
                key={i}
                className="border-[0.5px] border-[#8b5a2b]/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 2, delay: (i * 0.01) % 1 }}
              />
            ))}
          </div>
        </div>

        <div className="container max-w-4xl relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <TechBadge label="Next.js 15" />
              <TechBadge label="React 19" />
              <TechBadge label="Supabase" />
              <TechBadge label="LangGraph" />
              <TechBadge label="Tavily" />
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-[#5c4033] to-[#8b5a2b] bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Master AWS MLOps <br className="hidden md:block" />
            <span className="relative">
              <span className="relative z-10">With Confidence</span>
              <motion.span
                className="absolute bottom-1 left-0 h-3 bg-[#a98467]/30 size-full -z-10"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 1 }}
              />
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-[#5c4033]/80 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            A comprehensive learning platform designed specifically for AWS
            Machine Learning Specialty certification preparation
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-2 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Badge className="bg-[#a98467]/20 text-[#5c4033] hover:bg-[#a98467]/30 border-[#a98467]/30">
              Advanced RAG
            </Badge>
            <Badge className="bg-[#a98467]/20 text-[#5c4033] hover:bg-[#a98467]/30 border-[#a98467]/30">
              Code Sandbox
            </Badge>
            <Badge className="bg-[#a98467]/20 text-[#5c4033] hover:bg-[#a98467]/30 border-[#a98467]/30">
              Canvas Implementation
            </Badge>
            <Badge className="bg-[#a98467]/20 text-[#5c4033] hover:bg-[#a98467]/30 border-[#a98467]/30">
              Learning Guide
            </Badge>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-[#8b5a2b] hover:bg-[#6b4423] text-white group"
            >
              <Link href="/register" className="flex items-center gap-2">
                Explore Project
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 1.5,
                    repeatDelay: 2,
                  }}
                >
                  <ArrowRight className="size-4" />
                </motion.span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-[#8b5a2b] text-[#5c4033] hover:bg-[#a98467]/10"
            >
              <a
                href="https://github.com/surya-madhav/AWS-MLOps-Mentor"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="size-4" />
                View on GitHub
              </a>
            </Button>
          </motion.div>

          <motion.div
            className="mt-16 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <motion.a
              href="#features"
              className="text-[#5c4033] flex flex-col items-center"
              whileHover={{ y: 5 }}
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            >
              <span className="text-sm mb-2">Discover More</span>
              <ChevronDown className="size-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-[#a98467]/5 -skew-y-3 transform-gpu"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-[#a98467]/20 text-[#5c4033] text-sm font-medium mb-4">
              Platform Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#5c4033]">
              Key Features
            </h2>
            <p className="text-[#5c4033]/70 mt-4 max-w-2xl mx-auto">
              Our platform combines advanced AI capabilities with interactive
              learning tools to create a comprehensive AWS ML certification
              preparation experience
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
          >
            {/* Feature 1 */}
            <FeatureCard
              icon={<Brain className="size-6 text-[#8b5a2b]" />}
              title="Advanced CRAG"
              description="Context-aware AI retrieval with semantic chunking, cross-encoder reranking, and Tavily websearch integration."
              variants={cardVariants}
            />

            {/* Feature 2 */}
            <FeatureCard
              icon={<Code className="size-6 text-[#8b5a2b]" />}
              title="Code Sandbox"
              description="Run and test AWS ML code directly in your browser with real-time output visualization and AWS SDK integration."
              variants={cardVariants}
            />

            {/* Feature 3 */}
            <FeatureCard
              icon={<Layout className="size-6 text-[#8b5a2b]" />}
              title="Canvas Workspace"
              description="Collaborative workspace for notes, code, and diagrams with real-time rendering and multi-format support."
              variants={cardVariants}
            />

            {/* Feature 4 */}
            <FeatureCard
              icon={<BookOpen className="size-6 text-[#8b5a2b]" />}
              title="Learning Guide"
              description="Structured learning paths covering all AWS ML certification topics with interactive assessments and progress tracking."
              variants={cardVariants}
            />
          </motion.div>

          {/* Platform Preview */}
          <motion.div
            className="mt-20 rounded-xl overflow-hidden shadow-2xl border border-[#a98467]/30"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative size-full h-[400px] bg-[#2d2a24] rounded-t-xl">
              <div className="absolute top-0 inset-x-0 h-8 bg-[#3c3832] flex items-center px-4 gap-2">
                <div className="size-3 rounded-full bg-[#ff5f57]"></div>
                <div className="size-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="size-3 rounded-full bg-[#28c941]"></div>
                <div className="ml-4 text-xs text-white/70">
                  AWS MLOps Learning Platform
                </div>
              </div>
              <div className="pt-12 px-6 flex h-full">
                <div className="w-1/3 border-r border-white/10 p-4">
                  <div className="text-white/80 text-sm mb-4">
                    Learning Modules
                  </div>
                  {[
                    'Data Engineering',
                    'Exploratory Analysis',
                    'Model Training',
                    'Deployment',
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className={`py-2 px-3 rounded-md mb-2 text-sm ${i === 1 ? 'bg-[#a98467]/20 text-white' : 'text-white/60 hover:bg-white/5'}`}
                      whileHover={{ x: 5 }}
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
                <div className="flex-1 p-4">
                  <div className="bg-[#f8f5f0] rounded-md p-4 h-full flex flex-col">
                    <div className="text-[#5c4033] font-medium mb-3">
                      Interactive Code Sandbox
                    </div>
                    <div className="flex-1 bg-white/90 rounded-md p-3 text-xs font-mono text-[#2d2a24] overflow-hidden">
                      <div className="text-[#8b5a2b]">
                        # AWS SageMaker Example
                      </div>
                      <div className="mt-2">
                        <span className="text-blue-600">import</span> boto3
                        <br />
                        <span className="text-blue-600">import</span> pandas{' '}
                        <span className="text-blue-600">as</span> pd
                        <br />
                        <br />
                        <span className="text-green-600">
                          # Initialize SageMaker session
                        </span>
                        <br />
                        sagemaker = boto3.client(&apos;sagemaker&apos;)
                        <br />
                        <br />
                        <span className="text-green-600">
                          # Define model parameters
                        </span>
                        <br />
                        model_params = {'{'}
                        <br />
                        &nbsp;&nbsp;
                        <span className="text-orange-500">
                          &apos;AlgorithmSpecification&apos;
                        </span>
                        : {'{'}
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <span className="text-orange-500">
                          &apos;TrainingImage&apos;
                        </span>
                        :{' '}
                        <span className="text-orange-500">
                          &apos;123456789012.dkr.ecr.us-west-2.amazonaws.com/xgboost:1&apos;
                        </span>
                        <br />
                        &nbsp;&nbsp;{'}'}
                        <br />
                        {'}'}
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-[#a98467]/20 text-[#5c4033] text-sm font-medium mb-4">
              System Design
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#5c4033]">
              System Architecture
            </h2>
            <p className="text-[#5c4033]/70 mt-4 max-w-2xl mx-auto">
              Our platform is built with a modern, scalable architecture using
              cutting-edge technologies
            </p>
          </motion.div>

          <Tabs defaultValue="system" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#a98467]/10">
              <TabsTrigger
                value="system"
                className="data-[state=active]:bg-[#8b5a2b] data-[state=active]:text-white"
              >
                System Architecture
              </TabsTrigger>
              <TabsTrigger
                value="database"
                className="data-[state=active]:bg-[#8b5a2b] data-[state=active]:text-white"
              >
                Database Schema
              </TabsTrigger>
            </TabsList>
            <TabsContent value="system" className="mt-0">
              <motion.div
                className="bg-white rounded-xl border border-[#a98467]/30 shadow-xl p-6 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-[#5c4033]">
                    Four-Layer Architecture
                  </h3>
                  <p className="text-[#5c4033]/70 text-sm">
                    Client, Server, Data, and AI Integration layers
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <ArchitectureLayer
                    title="Client Layer"
                    icon={<Layout className="size-5 text-[#8b5a2b]" />}
                    items={[
                      'React UI Components',
                      'Canvas Implementation',
                      'Code Sandbox',
                    ]}
                  />
                  <ArchitectureLayer
                    title="Server Layer"
                    icon={<Server className="size-5 text-[#8b5a2b]" />}
                    items={[
                      'Next.js API Routes',
                      'NextAuth Authentication',
                      'LangGraph Orchestration',
                    ]}
                  />
                  <ArchitectureLayer
                    title="Data Layer"
                    icon={<Database className="size-5 text-[#8b5a2b]" />}
                    items={[
                      'Supabase Vector Store',
                      'PostgreSQL Database',
                      'Vercel Blob Storage',
                    ]}
                  />
                  <ArchitectureLayer
                    title="AI Integration"
                    icon={<Brain className="size-5 text-[#8b5a2b]" />}
                    items={[
                      'Retrieval Augmented Generation',
                      'Tavily Search API',
                      'AI Model Providers',
                    ]}
                  />
                </div>

                <div className="bg-[#f8f5f0] p-4 rounded-lg border border-[#a98467]/20">
                  <div className="text-sm text-[#5c4033]/70 mb-2 font-medium">
                    Data Flow
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="size-4 text-[#8b5a2b] mt-0.5 shrink-0" />
                      <span className="text-[#5c4033]/80">
                        Client interacts with Server through React components
                        and Next.js API routes
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="size-4 text-[#8b5a2b] mt-0.5 shrink-0" />
                      <span className="text-[#5c4033]/80">
                        Server performs data operations on the Data layer and
                        sends AI requests to the AI Integration layer
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="size-4 text-[#8b5a2b] mt-0.5 shrink-0" />
                      <span className="text-[#5c4033]/80">
                        AI Integration layer retrieves knowledge from the Data
                        layer and performs web searches via Tavily
                      </span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </TabsContent>
            <TabsContent value="database" className="mt-0">
              <motion.div
                className="bg-white rounded-xl border border-[#a98467]/30 shadow-xl p-6 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-[#5c4033]">
                    Database Schema
                  </h3>
                  <p className="text-[#5c4033]/70 text-sm">
                    Relational database design with PostgreSQL and Supabase
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <SchemaTable
                    name="User"
                    fields={[
                      { name: 'id', type: 'uuid', isPrimary: true },
                      { name: 'email', type: 'varchar(64)' },
                      { name: 'password', type: 'varchar(64)' },
                    ]}
                  />
                  <SchemaTable
                    name="Chat"
                    fields={[
                      { name: 'id', type: 'uuid', isPrimary: true },
                      { name: 'createdAt', type: 'timestamp' },
                      { name: 'title', type: 'text' },
                      { name: 'userId', type: 'uuid', isForeign: true },
                      { name: 'visibility', type: 'varchar' },
                    ]}
                  />
                  <SchemaTable
                    name="Message"
                    fields={[
                      { name: 'id', type: 'uuid', isPrimary: true },
                      { name: 'chatId', type: 'uuid', isForeign: true },
                      { name: 'role', type: 'varchar' },
                      { name: 'parts', type: 'json' },
                      { name: 'createdAt', type: 'timestamp' },
                    ]}
                  />
                </div>

                <div className="bg-[#f8f5f0] p-4 rounded-lg border border-[#a98467]/20">
                  <div className="text-sm text-[#5c4033]/70 mb-2 font-medium">
                    Key Relationships
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="size-4 text-[#8b5a2b] mt-0.5 shrink-0" />
                      <span className="text-[#5c4033]/80">
                        User creates many Chats, Documents, and tracks
                        UserContentProgress
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="size-4 text-[#8b5a2b] mt-0.5 shrink-0" />
                      <span className="text-[#5c4033]/80">
                        Chat contains many Messages and has many Votes
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="size-4 text-[#8b5a2b] mt-0.5 shrink-0" />
                      <span className="text-[#5c4033]/80">
                        Domains contain Topics, which contain ContentItems,
                        which are tracked by UserContentProgress
                      </span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Certification Section */}
      <section
        id="certification"
        className="py-24 px-4 relative bg-[#a98467]/10"
      >
        <div className="absolute inset-0 bg-[#a98467]/5 skew-y-3 transform-gpu"></div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-[#a98467]/20 text-[#5c4033] text-sm font-medium mb-4">
              AWS Certification
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#5c4033]">
              AWS Machine Learning Specialty Certification
            </h2>
            <p className="text-[#5c4033]/70 mt-4 max-w-2xl mx-auto">
              Our platform covers all four domains of the AWS Machine Learning
              Specialty certification exam
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
          >
            <CertificationDomain
              icon={<Database className="size-6 text-[#8b5a2b]" />}
              title="Data Engineering"
              percentage={20}
              description="Create, manage, and transform data repositories for machine learning"
              topics={[
                'Data repositories and storage options',
                'Batch vs streaming data processing',
                'ETL processes and data wrangling',
              ]}
              variants={cardVariants}
            />

            <CertificationDomain
              icon={<BarChart className="size-6 text-[#8b5a2b]" />}
              title="Exploratory Data Analysis"
              percentage={24}
              description="Sanitize, prepare, and analyze data for machine learning"
              topics={[
                'Data preparation and cleaning techniques',
                'Feature engineering and extraction',
                'Data visualization and statistical analysis',
              ]}
              variants={cardVariants}
            />

            <CertificationDomain
              icon={<Brain className="size-6 text-[#8b5a2b]" />}
              title="Modeling"
              percentage={36}
              description="Select, train, and tune machine learning models"
              topics={[
                'Algorithm selection and problem framing',
                'Model training and optimization algorithms',
                'Hyperparameter optimization techniques',
                'Model evaluation metrics and validation',
              ]}
              variants={cardVariants}
            />

            <CertificationDomain
              icon={<Server className="size-6 text-[#8b5a2b]" />}
              title="ML Implementation and Operations"
              percentage={20}
              description="Deploy, monitor, and maintain machine learning solutions"
              topics={[
                'Building robust and scalable ML solutions',
                'ML services selection and cost optimization',
                'Security for ML solutions and data',
                'Deployment, monitoring, and model versioning',
              ]}
              variants={cardVariants}
            />
          </motion.div>

          <motion.div
            className="mt-12 bg-white rounded-xl border border-[#a98467]/30 shadow-xl p-6 overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-[#5c4033]">
                AWS Machine Learning Services
              </h3>
              <p className="text-[#5c4033]/70 text-sm">
                Our platform covers all major AWS ML services
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {[
                'Amazon SageMaker',
                'Amazon Bedrock',
                'Amazon Comprehend',
                'Amazon Rekognition',
                'Amazon Translate',
                'Amazon Polly',
                'Amazon Transcribe',
                'Amazon Personalize',
                'Amazon Forecast',
                'Amazon Textract',
                'Amazon Lex',
                'Amazon Kendra',
              ].map((service, i) => (
                <motion.div
                  key={i}
                  className="border border-[#a98467]/30 bg-[#a98467]/5 text-[#5c4033] px-3 py-1.5 rounded-full text-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: 'rgba(169, 132, 103, 0.15)',
                  }}
                >
                  {service}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-[#a98467]/20 text-[#5c4033] text-sm font-medium mb-4">
              Technologies
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#5c4033]">
              Technology Stack
            </h2>
            <p className="text-[#5c4033]/70 mt-4 max-w-2xl mx-auto">
              Built with modern, cutting-edge technologies for optimal
              performance and developer experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-white rounded-xl border border-[#a98467]/30 shadow-sm p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{
                y: -5,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className="size-12 rounded-full bg-[#a98467]/20 flex items-center justify-center mb-4">
                <Layout className="size-6 text-[#8b5a2b]" />
              </div>
              <h3 className="text-xl font-semibold text-[#5c4033] mb-4">
                Frontend
              </h3>
              <ul className="space-y-2">
                {[
                  'Next.js 15.3.0 with App Router and PPR',
                  'React 19.0.0',
                  'Tailwind CSS with shadcn/ui components',
                  'SWR for efficient data fetching',
                  'Framer Motion for animations',
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <CheckCircle2 className="size-4 text-[#8b5a2b] mt-1 shrink-0" />
                    <span className="text-[#5c4033]/80 text-sm">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl border border-[#a98467]/30 shadow-sm p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{
                y: -5,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className="size-12 rounded-full bg-[#a98467]/20 flex items-center justify-center mb-4">
                <Server className="size-6 text-[#8b5a2b]" />
              </div>
              <h3 className="text-xl font-semibold text-[#5c4033] mb-4">
                Backend
              </h3>
              <ul className="space-y-2">
                {[
                  'Next.js API Routes',
                  'NextAuth for authentication',
                  'Drizzle ORM',
                  'PostgreSQL database',
                  'Vercel Blob for file storage',
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <CheckCircle2 className="size-4 text-[#8b5a2b] mt-1 shrink-0" />
                    <span className="text-[#5c4033]/80 text-sm">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl border border-[#a98467]/30 shadow-sm p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{
                y: -5,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className="size-12 rounded-full bg-[#a98467]/20 flex items-center justify-center mb-4">
                <Brain className="size-6 text-[#8b5a2b]" />
              </div>
              <h3 className="text-xl font-semibold text-[#5c4033] mb-4">
                AI Integration
              </h3>
              <ul className="space-y-2">
                {[
                  'AI SDK for model integration',
                  'LangGraph for RAG workflow orchestration',
                  'Tavily Search API for web search',
                  'Supabase for vector embeddings storage',
                  'xAI provider integration',
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <CheckCircle2 className="size-4 text-[#8b5a2b] mt-1 shrink-0" />
                    <span className="text-[#5c4033]/80 text-sm">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div
            className="mt-12 bg-[#f8f5f0] rounded-xl border border-[#a98467]/30 p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-[#5c4033] mb-4">
              Getting Started
            </h3>
            <div className="bg-[#2d2a24] rounded-md p-4 text-white/90 font-mono text-sm overflow-x-auto">
              <div className="mb-2"># Clone the repository</div>
              <div className="text-green-400">
                git clone https://github.com/surya-madhav/AWS-MLOps-Mentor
              </div>
              <div className="text-green-400">
                cd aws-mlops-learning-platform
              </div>
              <div className="mt-4 mb-2"># Install dependencies</div>
              <div className="text-green-400">pnpm install</div>
              <div className="mt-4 mb-2"># Configure environment variables</div>
              <div className="text-green-400">cp .env.example .env.local</div>
              <div className="text-white/70">
                # Edit .env.local with your API keys and database configuration
              </div>
              <div className="mt-4 mb-2"># Run database migrations</div>
              <div className="text-green-400">pnpm db:migrate</div>
              <div className="mt-4 mb-2"># Start the development server</div>
              <div className="text-green-400">pnpm dev</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          className="container mx-auto max-w-4xl bg-gradient-to-r from-[#8b5a2b] to-[#a98467] rounded-2xl p-10 text-white text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Zap className="size-12 mx-auto mb-6" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore This Academic Project
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Discover how advanced AI technologies can enhance learning
            experiences for AWS Machine Learning certification.
          </p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            whileHover={{ scale: 1.05 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-white text-[#8b5a2b] hover:bg-white/90"
            >
              <Link href="/register" className="flex items-center gap-2">
                View Project Demo
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              <a
                href="https://github.com/surya-madhav/AWS-MLOps-Mentor"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="size-4" />
                Star on GitHub
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 px-4 border-t border-[#a98467]/20">
        <div className="container mx-auto flex flex-col md:flex-row justify-center items-center">
          <motion.div
            className="text-[#5c4033]/70 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Made with <span className="text-red-500">❤️</span> by surya for
            northeastern
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

// Helper Components
function NavLink({ href, children, isActive }: NavLinkProps) {
  return (
    <motion.a
      href={href}
      className={`relative text-[#5c4033] hover:text-[#8b5a2b] transition-colors ${isActive ? 'font-medium' : ''}`}
      whileHover={{ scale: 1.05 }}
    >
      {children}
      {isActive && (
        <motion.span
          className="absolute bottom-0 left-0 size-full h-0.5 bg-[#8b5a2b]"
          layoutId="navIndicator"
        />
      )}
    </motion.a>
  );
}

function TechBadge({ label }: TechBadgeProps) {
  return (
    <motion.span
      className="inline-block py-1 px-3 rounded-full bg-[#a98467]/20 text-[#5c4033] text-sm font-medium"
      whileHover={{ scale: 1.05, backgroundColor: 'rgba(169, 132, 103, 0.3)' }}
    >
      {label}
    </motion.span>
  );
}

function FeatureCard({ icon, title, description, variants }: FeatureCardProps) {
  return (
    <motion.div
      variants={variants}
      whileHover="hover"
      className="bg-white rounded-xl border border-[#a98467]/30 shadow-sm overflow-hidden"
    >
      <div className="p-6">
        <div className="size-12 rounded-full bg-[#a98467]/20 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-[#5c4033] mb-2">{title}</h3>
        <p className="text-[#5c4033]/70">{description}</p>
      </div>
    </motion.div>
  );
}

function ArchitectureLayer({ title, icon, items }: ArchitectureLayerProps) {
  return (
    <motion.div
      className="bg-[#a98467]/10 rounded-lg p-4 border border-[#a98467]/20"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, backgroundColor: 'rgba(169, 132, 103, 0.2)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h4 className="font-medium text-[#5c4033]">{title}</h4>
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <motion.li
            key={i}
            className="text-sm text-[#5c4033]/80"
            initial={{ opacity: 0, x: -5 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            • {item}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

function SchemaTable({ name, fields }: SchemaTableProps) {
  return (
    <motion.div
      className="bg-[#a98467]/10 rounded-lg p-4 border border-[#a98467]/20"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, backgroundColor: 'rgba(169, 132, 103, 0.2)' }}
    >
      <h4 className="font-medium text-[#5c4033] mb-2">{name}</h4>
      <div className="space-y-1">
        {fields.map((field, i) => (
          <div key={i} className="text-sm flex items-center gap-2">
            <span className="text-[#8b5a2b] font-mono">{field.name}</span>
            <span className="text-[#5c4033]/60 text-xs">{field.type}</span>
            {field.isPrimary && (
              <Badge className="bg-[#8b5a2b]/20 text-[#8b5a2b] text-xs">
                PK
              </Badge>
            )}
            {field.isForeign && (
              <Badge className="bg-[#8b5a2b]/20 text-[#8b5a2b] text-xs">
                FK
              </Badge>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function CertificationDomain({
  icon,
  title,
  percentage,
  description,
  topics,
  variants,
}: CertificationDomainProps) {
  return (
    <motion.div
      variants={variants}
      whileHover="hover"
      className="bg-white rounded-xl border border-[#a98467]/30 shadow-sm overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="size-12 rounded-full bg-[#a98467]/20 flex items-center justify-center">
            {icon}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#8b5a2b]">
              {percentage}%
            </span>
            <div className="w-16 h-2 bg-[#a98467]/20 rounded-full overflow-hidden">
              <motion.div
                className="size-full bg-[#8b5a2b] rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: `${percentage * 2}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-[#5c4033] mb-2">{title}</h3>
        <p className="text-[#5c4033]/70 mb-4">{description}</p>
        <div className="space-y-2">
          {topics.map((topic, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-2"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <CheckCircle2 className="size-4 text-[#8b5a2b] mt-1 shrink-0" />
              <span className="text-[#5c4033]/80 text-sm">{topic}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
