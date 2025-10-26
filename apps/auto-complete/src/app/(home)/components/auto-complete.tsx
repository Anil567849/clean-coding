"use client";
import { Search, User as UserIcon, X } from "lucide-react";
import React, { useEffect } from "react";
import { useDebounce } from "@/app/hooks/use-debouce";
import { type User, useFetch } from "@/app/hooks/use-fetch";
import { Button } from "@/packages/ui/components/button";
import { Input } from "@/packages/ui/components/input";

/**

Flow:
1. When user type text will change
2. Text will trigger useDebounce - it will clear old timeout and register new timeout
3. After timeout new value return
4. When value change it will trigger useEffect and setUrl
5. setUrl - url will change and trigger useFetch.
6. New Data fetch and shown in the UI.
 */

const TIME_DELAY = 200;

export function AutoComplete() {
  const [isFocused, setIsFocused] = React.useState(false);
  const [text, setText] = React.useState("");
  const [url, setUrl] = React.useState("");
  const { data, loading } = useFetch(url);
  const value = useDebounce<string>(text, TIME_DELAY);
  const showResults = isFocused && text.length > 0;

  useEffect(() => {
    function getData() {
      if (value === "") {
        return;
      }
      setUrl(`https://dummyjson.com/users/search?q=${value}`);
    }

    getData();
  }, [value]);

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <div className="mb-6 flex flex-col items-center justify-center">
        <h1 className="mb-2 font-bold text-3xl text-gray-200">
          Auto Complete App
        </h1>
        <p className="text-gray-400 text-sm">
          Start typing to search for users
        </p>
      </div>

      <div className="relative">
        {/* Search Input */}
        <div className="relative">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-gray-400" />
          <Input
            className="rounded-lg border-2 border-gray-200 bg-white py-6 pr-10 pl-10 text-gray-800 shadow-sm transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            onBlur={() => setTimeout(() => setIsFocused(false), TIME_DELAY)}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search users..."
            value={text}
          />
          {text && (
            <Button
              className="-translate-y-1/2 absolute top-1/2 right-3 transform text-gray-400 transition-colors hover:text-gray-600"
              onClick={() => setText("")}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Results Dropdown */}
        {showResults && (
          <div className="absolute z-10 mt-2 max-h-96 w-full overflow-y-auto rounded-lg border-2 border-gray-200 bg-white shadow-lg">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-amber-500 border-b-2" />
                <p className="ml-3 text-gray-600">Searching...</p>
              </div>
            )}

            {data?.users && data.users.length > 0 ? (
              <ul className="py-2">
                {data.users.map((user: User) => (
                  <li
                    className="cursor-pointer border-gray-100 border-b px-4 py-3 transition-colors last:border-b-0 hover:bg-amber-50"
                    key={user.id}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
                        <UserIcon className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-gray-800">
                          {user.firstName} {user.lastName || ""}
                        </p>
                        {user.email && (
                          <p className="truncate text-gray-500 text-sm">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-8 text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <UserIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="font-medium text-gray-600">No users found</p>
                <p className="mt-1 text-gray-500 text-sm">
                  Try adjusting your search
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
