import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";

import { Skeleton } from "@/components/ui/skeleton";

export function UserProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Skeleton for Profile Header */}
      <Card>
        <CardContent className="px-6">
          <div className="flex flex-col md:flex-row gap-4 sm:gap-8">
            {/* Avatar + Name */}
            <div className="flex flex-col items-center md:items-start">
              <Skeleton className="h-20 w-20 rounded-full" />

              <div className="mt-4 text-center md:text-left space-y-2">
                <Skeleton className="h-5 w-32 mx-auto md:mx-0" />
                <Skeleton className="h-4 w-20 mx-auto md:mx-0" />
                <div className="flex gap-2 justify-center md:justify-start">
                  <Skeleton className="h-5 w-12 rounded-md" />
                  <Skeleton className="h-5 w-20 rounded-md" />
                </div>
              </div>
            </div>

            {/* Bio & Stats */}
            <div className="flex-1 space-y-4">
              {/* Bio Section */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Stats */}
              <div className="flex items-center flex-wrap gap-6 sm:gap-8 md:gap-10 pt-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-5 w-14 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>

              {/* Follow Button */}
              <Skeleton className="h-8 w-24 mt-4 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs with Trigger Buttons */}
      <Tabs defaultValue="prompts" className="w-full">
        <TabsList className="w-auto mr-auto grid grid-cols-3 overflow-x-auto">
          {["Shared Prompts", "Followers", "Following"].map((label, i) => (
            <Skeleton key={i} className="h-8 w-32 rounded-md" />
          ))}
        </TabsList>

        {/* Tab Content Area */}
        <TabsContent value="prompts" className="space-y-4 mt-1">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="p-0">
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-2 flex-wrap">
                  {[...Array(3)].map((_, j) => (
                    <Skeleton key={j} className="h-5 w-14 rounded-md" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
