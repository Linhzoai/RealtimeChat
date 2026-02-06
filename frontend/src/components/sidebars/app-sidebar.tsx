"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import CreateNewChat from "../chat/createNewChat";
import NewGroupChatModal from "../chat/newGroupChatModal";
import GroupChatList from "../chat/groupChatList";
import AddFriendModal from "../chat/addFriendModal";
import DirectMessageList from "../chat/dirrectMessageList";
import { useThemeStore } from "@/stores/useThemeStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { NavUser } from "./nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {isDark, toggleTheme} = useThemeStore();
  const {user} = useAuthStore();
   
  return (
    <Sidebar variant="inset" {...props} >
      <SidebarHeader >
        {/* Header */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="bg-gradient-primary data-[state=checked]:bg-gradient-secondary" size="lg" asChild >
              <a href="#">
                <div className="flex w-full items-center px-2 justify-between">
                  <h1 className="text-xl font-bold text-white"> Realtime chat </h1>
                  <div className="flex items-center gap-2">
                    <Sun className="size-4 text-white/80" />
                    <Switch
                      checked={isDark}
                      onCheckedChange={toggleTheme}
                      className="data-[state=checked]:bg-background/80"
                    />
                    <Moon className="size-4 text-white/80" />
                  </div>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="beautiful-scrollbar">
        {/* New chat */}
        <SidebarGroup>
          <SidebarGroupContent>
            <CreateNewChat/>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Group chat */}
        <SidebarGroup>
          <div className="flex items-center justify-between">
            <SidebarGroupLabel className="uppercase">
             Nhóm chat
            </SidebarGroupLabel>
            <NewGroupChatModal/>
          </div>
          <SidebarGroupContent>
            <GroupChatList/>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Direct Message */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">
            Bạn bè
          </SidebarGroupLabel>
          <SidebarGroupAction title="Kết bạn" className="cursor-pointer">
            <AddFriendModal/>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <DirectMessageList/>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        {
        user && <NavUser user={user} />
        } 
      </SidebarFooter>
    </Sidebar>
  );
}
