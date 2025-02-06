import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthProvider";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Logged in as: <span className="font-medium text-foreground">{user}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home; 