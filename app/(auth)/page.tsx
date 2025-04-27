'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, Code, Layout, Brain } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="container max-w-4xl">
          <h1 className="text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            AWS MLOps Learning Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Master AWS Machine Learning for certification success through interactive learning, hands-on coding, and advanced AI assistance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/register">Sign Up Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Already have an account? Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose Our Platform</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <Card className="border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-500" />
                  Advanced RAG
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Context-aware AI retrieval with semantic chunking and cross-encoder reranking for precise answers.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-500" />
                  Code Sandbox
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Run and test AWS ML code directly in your browser with instant feedback and visualizations.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="w-5 h-5 text-blue-500" />
                  Canvas Workspace
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Collaborate using our ChatGPT-style canvas for code, diagrams, and notes in one workspace.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  Structured Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Follow a certification-aligned curriculum with progress tracking and interactive assessments.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Certification Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8">Prepare for AWS Machine Learning Specialty</h2>
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="text-blue-500">●</span> Data Engineering
                </h3>
                <p className="text-muted-foreground">Learn ETL processes, data pipelines, and AWS storage services.</p>
                
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="text-blue-500">●</span> Exploratory Data Analysis
                </h3>
                <p className="text-muted-foreground">Master data preparation, feature engineering, and visualization techniques.</p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="text-blue-500">●</span> Modeling
                </h3>
                <p className="text-muted-foreground">Select, train and tune machine learning models with best practices.</p>
                
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="text-blue-500">●</span> ML Implementation
                </h3>
                <p className="text-muted-foreground">Deploy, monitor, and maintain production ML solutions on AWS.</p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 group">
                <Link href="/register" className="flex items-center gap-2">
                  Start Learning Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 px-4 border-t">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-muted-foreground mb-4 md:mb-0">
            © 2025 AWS MLOps Learning Platform
          </div>
          <div className="flex gap-6">
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
