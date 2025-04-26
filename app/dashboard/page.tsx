'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "../(auth)/auth";

export default function Page() {
    return (
        <div className="flex h-dvh w-full flex-col gap-8 p-8 bg-background">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome to your dashboard.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Conversations</CardTitle>
                        <CardDescription>Your most recent chat conversations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>You have no recent conversations.</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Stats</CardTitle>
                        <CardDescription>Usage statistics and metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Total Conversations</span>
                                <span>0</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Total Messages</span>
                                <span>0</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Getting Started</CardTitle>
                        <CardDescription>Tips to help you get started</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Click on the Chat icon to start a new conversation</li>
                            <li>Explore the dashboard to view your stats</li>
                            <li>Customize your chat preferences</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
