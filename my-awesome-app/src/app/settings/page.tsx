import { Metadata } from 'next'
import { Settings as SettingsIcon, User, Bell, Lock, Database } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'Settings - My Awesome Notes',
  description: 'Manage your account and preferences',
}

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Display Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              defaultValue="Demo User"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              defaultValue="demo@example.com"
            />
          </div>
          <Separator />
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Task Reminders</div>
              <div className="text-xs text-muted-foreground">
                Get notified about upcoming task deadlines
              </div>
            </div>
            <input type="checkbox" className="rounded border-input" defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Daily Summary</div>
              <div className="text-xs text-muted-foreground">
                Receive a daily summary of your activity
              </div>
            </div>
            <input type="checkbox" className="rounded border-input" defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Email Notifications</div>
              <div className="text-xs text-muted-foreground">
                Receive notifications via email
              </div>
            </div>
            <input type="checkbox" className="rounded border-input" />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Button variant="outline" className="w-full sm:w-auto">
              Change Password
            </Button>
          </div>
          <Separator />
          <div>
            <Button variant="outline" className="w-full sm:w-auto">
              Enable Two-Factor Authentication
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full sm:w-auto">
              Export Data
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              Import Data
            </Button>
          </div>
          <Separator />
          <div>
            <Button variant="destructive" className="w-full sm:w-auto">
              Delete Account
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

