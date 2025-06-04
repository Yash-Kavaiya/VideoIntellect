'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  FileText, 
  PenTool, 
  Edit, 
  HelpCircle, 
  Search, 
  MessageCircle,
  Play,
  Cpu,
  Zap,
  Shield,
  Users,
  Brain,
  ChevronRight,
  Download,
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  Mail,
  Linkedin,
  Github
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [activeFeature, setActiveFeature] = useState(0);

  // Navigation handlers
  const handleGetStarted = () => {
    router.push('/app?view=upload');
  };

  const handleWatchDemo = () => {
    router.push('/app?view=demo');
  };

  const handleFeatureNavigation = (featureType: string) => {
    const routeMap: Record<string, string> = {
      'summary': '/app?view=meetings&tab=summary',
      'notes': '/app?view=meetings&tab=notes',
      'blog': '/app?view=meetings&tab=blog',
      'mcq': '/app?view=meetings&tab=mcq',
      'search': '/app?view=meetings&tab=search',
      'chat': '/app?view=meetings&tab=chat'
    };
    
    router.push(routeMap[featureType] || '/app');
  };

  const handleUploadVideo = () => {
    router.push('/app?view=upload');
  };

  const handleViewDashboard = () => {
    router.push('/app?view=dashboard');
  };

  const handleViewAnalytics = () => {
    router.push('/app?view=analytics');
  };

  const handleViewMeetings = () => {
    router.push('/app?view=meetings');
  };

  const features = [
    {
      icon: FileText,
      title: 'AI-Powered Video Summary',
      description: 'Get instant, intelligent summaries of your meeting videos with key insights and action items.',
      details: 'Our OPEA™-powered AI analyzes your entire meeting and extracts the most important points, decisions made, and action items assigned.',
      color: 'bg-blue-500',
      actionType: 'summary'
    },
    {
      icon: PenTool,
      title: 'Smart Notes Generation',
      description: 'Automatically generate comprehensive notes with timestamps and speaker identification.',
      details: 'Generate detailed meeting notes with precise timestamps, speaker identification, and topic categorization.',
      color: 'bg-green-500',
      actionType: 'notes'
    },
    {
      icon: Edit,
      title: 'Blog Content Creation',
      description: 'Transform your meetings into engaging blog posts for knowledge sharing.',
      details: 'Convert meeting insights into well-structured blog posts perfect for internal knowledge sharing or external communication.',
      color: 'bg-purple-500',
      actionType: 'blog'
    },
    {
      icon: HelpCircle,
      title: 'MCQ Generation',
      description: 'Create assessment questions from meeting content for training and evaluation.',
      details: 'Automatically generate multiple-choice questions from meeting content for training assessments and knowledge validation.',
      color: 'bg-orange-500',
      actionType: 'mcq'
    },
    {
      icon: Search,
      title: 'Transcript Search',
      description: 'Search through entire video transcripts to find specific topics or discussions.',
      details: 'Powerful search functionality to quickly locate specific topics, decisions, or discussions across all your meeting transcripts.',
      color: 'bg-red-500',
      actionType: 'search'
    },
    {
      icon: MessageCircle,
      title: 'AI Chat Assistant',
      description: 'Interactive AI agent to help you navigate and understand your meeting content.',
      details: 'Chat with our AI assistant to get answers about your meetings, find specific information, and gain deeper insights.',
      color: 'bg-indigo-500',
      actionType: 'chat'
    },
  ];

  const techStack = [
    {
      icon: Cpu,
      title: 'Intel® Xeon® Processors',
      description: 'High-performance computing for complex AI workloads',
    },
    {
      icon: Zap,
      title: 'Intel® Gaudi® AI Accelerators',
      description: 'Optimized hardware for deep learning and AI inference',
    },
    {
      icon: Brain,
      title: 'OPEA™ Platform',
      description: 'Open Platform for Enterprise AI with modular microservices',
    },
    {
      icon: Shield,
      title: 'Intel® Tiber AI Cloud',
      description: 'Secure cloud infrastructure for AI development',
    },
  ];

  const developers = [
    {
      name: 'Chetan Sonigra',
      role: 'Full Stack Developer',
      email: 'chetan.sonigra@example.com',
      linkedin: 'https://linkedin.com/in/chetansonigra',
      github: 'https://github.com/chetansonigra',
      avatar: '/avatars/chetan.jpg',
    },
    {
      name: 'Yash Kavaiya',
      role: 'AI/ML Developer',
      email: 'yash.kavaiya@example.com',
      linkedin: 'https://linkedin.com/in/yashkavaiya',
      github: 'https://github.com/yashkavaiya',
      avatar: '/avatars/yash.jpg',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-intel-blue via-intel-light-blue to-intel-navy text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              Powered by Intel OPEA™ Platform
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Intelligent Meeting Assistant
            </h1>
            
            <p className="text-xl lg:text-2xl mb-8 text-white/90">
              Transform your enterprise meetings with AI-powered summaries, notes, and insights 
              using Intel's cutting-edge OPEA™ platform and hardware acceleration.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-white text-intel-blue hover:bg-gray-100"
                onClick={handleGetStarted}
              >
                <Upload className="mr-2 h-5 w-5" />
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-intel-blue"
                onClick={handleWatchDemo}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold">99.5%</div>
                <div className="text-white/80">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">10x</div>
                <div className="text-white/80">Faster</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-white/80">Secure</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-intel-navy mb-4">
              Powerful AI Features
            </h2>
            <p className="text-xl text-intel-gray max-w-3xl mx-auto">
              Leverage Intel's OPEA™ platform to unlock comprehensive meeting intelligence 
              with enterprise-grade AI capabilities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full border-2 border-transparent group-hover:border-intel-blue transition-all duration-300 intel-shadow group-hover:intel-shadow-lg cursor-pointer">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-intel-navy group-hover:text-intel-blue transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-intel-gray text-sm mb-4">{feature.details}</p>
                    <Button 
                      variant="ghost" 
                      className="p-0 h-auto text-intel-blue"
                      onClick={() => handleFeatureNavigation(feature.actionType)}
                    >
                      Try this feature <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Access Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                onClick={handleUploadVideo}
                className="intel-gradient text-white"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Video
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleViewDashboard}
                className="border-intel-blue text-intel-blue hover:bg-intel-blue hover:text-white"
              >
                View Dashboard
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleViewAnalytics}
                className="border-intel-blue text-intel-blue hover:bg-intel-blue hover:text-white"
              >
                Analytics
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section id="technology" className="py-20 bg-intel-light-gray">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-intel-navy mb-4">
              Powered by Intel Technology
            </h2>
            <p className="text-xl text-intel-gray max-w-3xl mx-auto">
              Built on Intel's industry-leading hardware and the revolutionary OPEA™ platform 
              for enterprise AI applications.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Card className="text-center group-hover:scale-105 transition-transform duration-300 intel-shadow">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 intel-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-intel-glow">
                      <tech.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-intel-navy mb-2">{tech.title}</h3>
                    <p className="text-sm text-intel-gray">{tech.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl p-8 intel-shadow-lg"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-intel-navy mb-4">
                  OPEA™ Platform Integration
                </h3>
                <p className="text-intel-gray mb-6">
                  Our solution leverages the Open Platform for Enterprise AI (OPEA™) with its modular, 
                  composable, and secure architecture. Built with Intel's microservices framework 
                  for maximum scalability and performance.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-intel-gray">Modular microservices architecture</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-intel-gray">Enterprise-grade security</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-intel-gray">Optimized for Intel hardware</span>
                  </div>
                </div>
              </div>
              <div className="bg-intel-light-gray rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-intel-gray">CPU Optimization</span>
                    <span className="text-intel-blue font-semibold">Intel® Xeon®</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-intel-gray">AI Acceleration</span>
                    <span className="text-intel-blue font-semibold">Intel® Gaudi®</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-intel-gray">Inference Engine</span>
                    <span className="text-intel-blue font-semibold">OpenVINO™</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-intel-gray">Cloud Platform</span>
                    <span className="text-intel-blue font-semibold">Intel® Tiber AI Cloud</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-intel-navy mb-4">
              See It In Action
            </h2>
            <p className="text-xl text-intel-gray max-w-3xl mx-auto">
              Experience the power of AI-driven meeting intelligence with our interactive demo.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <Card className="intel-shadow-lg">
              <CardContent className="p-0">
                <div className="bg-intel-light-gray rounded-t-lg p-6 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 intel-gradient rounded-full flex items-center justify-center">
                        <Upload className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-intel-navy">Upload Your Meeting Video</h3>
                        <p className="text-intel-gray text-sm">Drag & drop or click to select</p>
                      </div>
                    </div>
                    <Button 
                      className="intel-gradient text-white"
                      onClick={handleGetStarted}
                    >
                      Try Demo
                    </Button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-intel-navy">Instant Results:</h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-intel-blue mr-2" />
                          <span className="text-sm text-intel-gray">Video processed in &lt; 2 minutes</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-intel-blue mr-2" />
                          <span className="text-sm text-intel-gray">99.5% transcription accuracy</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-intel-blue mr-2" />
                          <span className="text-sm text-intel-gray">Automatic speaker identification</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-intel-navy">Generated Content:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Badge 
                          variant="secondary"
                          className="cursor-pointer hover:bg-intel-blue hover:text-white"
                          onClick={() => handleFeatureNavigation('summary')}
                        >
                          Summary
                        </Badge>
                        <Badge 
                          variant="secondary"
                          className="cursor-pointer hover:bg-intel-blue hover:text-white"
                          onClick={() => handleFeatureNavigation('notes')}
                        >
                          Notes
                        </Badge>
                        <Badge 
                          variant="secondary"
                          className="cursor-pointer hover:bg-intel-blue hover:text-white"
                          onClick={() => handleFeatureNavigation('blog')}
                        >
                          Blog Post
                        </Badge>
                        <Badge 
                          variant="secondary"
                          className="cursor-pointer hover:bg-intel-blue hover:text-white"
                          onClick={() => handleFeatureNavigation('mcq')}
                        >
                          MCQs
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 intel-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Transform Your Meetings?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Join the future of enterprise AI with Intel's OPEA™ platform. 
              Start analyzing your meetings with unparalleled intelligence today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <div className="flex max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                />
                <Button 
                  className="ml-2 bg-white text-intel-blue hover:bg-gray-100"
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-intel-blue"
                onClick={handleViewMeetings}
              >
                <ArrowRight className="mr-2 h-5 w-5" />
                Explore Features
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-intel-blue"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Whitepaper
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-intel-light-gray">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-intel-navy mb-4">
              Meet the Developers
            </h2>
            <p className="text-xl text-intel-gray max-w-2xl mx-auto">
              Built by passionate developers for the Intel Hackathon, 
              leveraging cutting-edge AI technology to solve real enterprise challenges.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {developers.map((dev, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="text-center intel-shadow hover:intel-shadow-lg transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <div className="w-20 h-20 intel-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl text-white font-bold">
                        {dev.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-intel-navy mb-2">{dev.name}</h3>
                    <p className="text-intel-blue font-medium mb-4">{dev.role}</p>
                    
                    <div className="flex justify-center space-x-4">
                      <Button size="sm" variant="outline" className="border-intel-blue text-intel-blue hover:bg-intel-blue hover:text-white">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                      <Button size="sm" variant="outline" className="border-intel-blue text-intel-blue hover:bg-intel-blue hover:text-white">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                      <Button size="sm" variant="outline" className="border-intel-blue text-intel-blue hover:bg-intel-blue hover:text-white">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Card className="max-w-2xl mx-auto intel-shadow">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-intel-navy mb-4">
                  Intel Hackathon 2025
                </h3>
                <p className="text-intel-gray mb-4">
                  This project was developed for the Intel Enterprise AI Developers Hackathon, 
                  showcasing the power of OPEA™ platform and Intel's cutting-edge AI hardware.
                </p>
                <div className="flex justify-center space-x-4">
                  <Badge className="bg-intel-blue">OPEA™ Platform</Badge>
                  <Badge className="bg-intel-light-blue">Intel® Hardware</Badge>
                  <Badge className="bg-intel-navy">Enterprise AI</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}