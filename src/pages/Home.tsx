import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Hand, Camera, Type, Volume2, Globe, Zap } from "lucide-react";
import Navigation from "@/components/Navigation";

const Home = () => {
  const features = [
    {
      icon: Camera,
      title: "Real-Time Recognition",
      description: "Instantly capture and recognize hand gestures using your camera",
    },
    {
      icon: Type,
      title: "Letter by Letter",
      description: "See each recognized letter appear in real-time as you sign",
    },
    {
      icon: Volume2,
      title: "Text-to-Speech",
      description: "Convert recognized text to speech for immediate communication",
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Translate recognized text into multiple languages",
    },
    {
      icon: Zap,
      title: "High Accuracy",
      description: "Advanced AI ensures maximum matching and recognition accuracy",
    },
    {
      icon: Hand,
      title: "ASL Support",
      description: "Full support for American Sign Language fingerspelling",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-block">
              <div className="bg-gradient-hero rounded-2xl p-4 shadow-glow mb-6">
                <Hand className="h-20 w-20 text-primary-foreground animate-pulse-glow" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Speak Without
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                a Voice
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              SilentTalk bridges communication gaps by converting sign language gestures 
              into text and speech in real-time
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="text-lg gradient-primary shadow-glow" asChild>
                <Link to="/recognize">
                  <Camera className="mr-2 h-5 w-5" />
                  Start Recognition
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg" asChild>
                <a href="#features">
                  Learn More
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need for seamless sign language communication
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-smooth animate-slide-up border-border/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-gradient-primary rounded-lg p-3 w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-12 text-center bg-gradient-hero border-0 shadow-glow">
            <h2 className="text-4xl font-bold text-primary-foreground mb-4">
              Ready to Break Communication Barriers?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Start using SilentTalk today and experience the power of real-time sign language recognition
            </p>
            <Button size="lg" variant="secondary" className="text-lg shadow-lg" asChild>
              <Link to="/recognize">
                <Hand className="mr-2 h-5 w-5" />
                Get Started Now
              </Link>
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2024 SilentTalk - Empowering Communication Through Technology</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
