import { ShieldOff } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function UnauthorizedPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="space-y-4 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                        <ShieldOff aria-hidden className="h-7 w-7" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Badge className="mx-auto text-red-600" variant="outline">
                            Access denied
                        </Badge>
                        <CardTitle className="text-2xl">Unauthorized</CardTitle>
                        <CardDescription>
                            You do not have permission to view this page. If you think this is
                            a mistake, try signing in with a different account.
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-2 text-center text-muted-foreground text-sm">
                    <p>Reasons you might see this page:</p>
                    <ul className="list-disc space-y-1 text-left text-muted-foreground/90">
                        <li>Your session expired.</li>
                        <li>Your account lacks the required permissions.</li>
                        <li>You followed an outdated or invalid link.</li>
                    </ul>
                </CardContent>

                <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button asChild variant="secondary">
                        <a href="/">Go home</a>
                    </Button>
                    <Button asChild>
                        <a href="/sign-in">Sign in</a>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
