import { useState } from 'react';
import { Instagram, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AccountSettingsProps {
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
}

const timezones = [
  { value: 'UTC-12:00', label: 'UTC-12:00 (Baker Island)' },
  { value: 'UTC-11:00', label: 'UTC-11:00 (American Samoa)' },
  { value: 'UTC-10:00', label: 'UTC-10:00 (Hawaii)' },
  { value: 'UTC-09:30', label: 'UTC-09:30 (Marquesas Islands)' },
  { value: 'UTC-09:00', label: 'UTC-09:00 (Alaska)' },
  { value: 'UTC-08:00', label: 'UTC-08:00 (Pacific Time)' },
  { value: 'UTC-07:00', label: 'UTC-07:00 (Mountain Time)' },
  { value: 'UTC-06:00', label: 'UTC-06:00 (Central Time)' },
  { value: 'UTC-05:00', label: 'UTC-05:00 (Eastern Time)' },
  { value: 'UTC-04:00', label: 'UTC-04:00 (Atlantic Time)' },
  { value: 'UTC-03:30', label: 'UTC-03:30 (Newfoundland)' },
  { value: 'UTC-03:00', label: 'UTC-03:00 (Argentina, Brazil)' },
  { value: 'UTC-02:00', label: 'UTC-02:00 (South Georgia)' },
  { value: 'UTC-01:00', label: 'UTC-01:00 (Azores)' },
  { value: 'UTC+00:00', label: 'UTC+00:00 (GMT, London)' },
  { value: 'UTC+01:00', label: 'UTC+01:00 (Central European Time)' },
  { value: 'UTC+02:00', label: 'UTC+02:00 (Eastern European Time)' },
  { value: 'UTC+03:00', label: 'UTC+03:00 (Moscow, East Africa)' },
  { value: 'UTC+03:30', label: 'UTC+03:30 (Iran)' },
  { value: 'UTC+04:00', label: 'UTC+04:00 (Gulf, Samara)' },
  { value: 'UTC+04:30', label: 'UTC+04:30 (Afghanistan)' },
  { value: 'UTC+05:00', label: 'UTC+05:00 (Pakistan, West Asia)' },
  { value: 'UTC+05:30', label: 'UTC+05:30 (India, Sri Lanka)' },
  { value: 'UTC+05:45', label: 'UTC+05:45 (Nepal)' },
  { value: 'UTC+06:00', label: 'UTC+06:00 (Bangladesh, Central Asia)' },
  { value: 'UTC+06:30', label: 'UTC+06:30 (Myanmar)' },
  { value: 'UTC+07:00', label: 'UTC+07:00 (Thailand, Vietnam)' },
  { value: 'UTC+08:00', label: 'UTC+08:00 (China, Singapore)' },
  { value: 'UTC+08:30', label: 'UTC+08:30 (North Korea)' },
  { value: 'UTC+08:45', label: 'UTC+08:45 (Eucla)' },
  { value: 'UTC+09:00', label: 'UTC+09:00 (Japan, Korea)' },
  { value: 'UTC+09:30', label: 'UTC+09:30 (Adelaide)' },
  { value: 'UTC+10:00', label: 'UTC+10:00 (Sydney, Vladivostok)' },
  { value: 'UTC+10:30', label: 'UTC+10:30 (Lord Howe Island)' },
  { value: 'UTC+11:00', label: 'UTC+11:00 (Solomon Islands)' },
  { value: 'UTC+12:00', label: 'UTC+12:00 (Fiji, New Zealand)' },
  { value: 'UTC+12:45', label: 'UTC+12:45 (Chatham Islands)' },
  { value: 'UTC+13:00', label: 'UTC+13:00 (Tonga, Samoa)' },
  { value: 'UTC+14:00', label: 'UTC+14:00 (Line Islands)' },
];

const AccountSettings = ({ isConnected, setIsConnected }: AccountSettingsProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState('UTC-08:00');
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!username || !password) {
      toast({
        title: "Missing Credentials",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsConnected(true);
      toast({
        title: "Connected Successfully!",
        description: "Your Instagram account has been connected",
      });
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setUsername('');
    setPassword('');
    toast({
      title: "Account Disconnected",
      description: "Your Instagram account has been disconnected",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
        {isConnected && (
          <Badge className="bg-green-100 text-green-800">
            <Check className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        )}
      </div>

      {/* Connection Status Alert */}
      <Alert className={isConnected ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}>
        <AlertCircle className={`h-4 w-4 ${isConnected ? 'text-green-600' : 'text-orange-600'}`} />
        <AlertDescription className={isConnected ? 'text-green-800' : 'text-orange-800'}>
          {isConnected 
            ? "Your Instagram account is connected and ready for scheduling posts."
            : "Connect your Instagram account to start scheduling posts automatically."
          }
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Instagram Connection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Instagram className="h-5 w-5 text-purple-600" />
              <span>Instagram Account</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isConnected ? (
              <>
                <div>
                  <Label htmlFor="username">Instagram Username</Label>
                  <Input
                    id="username"
                    placeholder="your_username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your credentials are encrypted and stored securely. We use them only to schedule your posts.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={handleConnect}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Instagram className="h-4 w-4 mr-2" />
                      Connect Instagram
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Instagram className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">@{username || 'your_username'}</h3>
                <p className="text-sm text-gray-500 mb-4">Connected and ready to schedule</p>
                <Button
                  variant="outline"
                  onClick={handleDisconnect}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  Disconnect Account
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scheduling Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Scheduling Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Time Zone</Label>
              <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Select your timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((timezone) => (
                    <SelectItem key={timezone.value} value={timezone.value}>
                      {timezone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Auto-posting</Label>
              <div className="flex items-center space-x-2 mt-2">
                <input type="checkbox" id="autopost" className="rounded" defaultChecked />
                <label htmlFor="autopost" className="text-sm">
                  Automatically publish scheduled posts
                </label>
              </div>
            </div>

            <div>
              <Label>Notifications</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="notify-success" className="rounded" defaultChecked />
                  <label htmlFor="notify-success" className="text-sm">
                    Notify when posts are published
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="notify-fail" className="rounded" defaultChecked />
                  <label htmlFor="notify-fail" className="text-sm">
                    Notify if posting fails
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Account Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-lg font-bold text-purple-600">1.2K</p>
                  <p className="text-xs text-purple-700">Followers</p>
                </div>
                <div className="text-center p-3 bg-pink-50 rounded-lg">
                  <p className="text-lg font-bold text-pink-600">156</p>
                  <p className="text-xs text-pink-700">Posts</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountSettings;
