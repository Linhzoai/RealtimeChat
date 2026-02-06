import {create} from "zustand";
import {persist} from "zustand/middleware";
import type {ThemeState} from "../types/store";
export const useThemeStore = create<ThemeState>()(
    persist(
        (set) =>({
            isDark: false,
            toggleTheme: () => {
                set((state)=>{
                    const dark = !state.isDark;
                    document.documentElement.classList.toggle("dark", dark);
                    return{isDark: dark};
                })
            },
            setTheme: (dark: boolean) => {
                set({isDark: dark});
                if(dark){
                    document.documentElement.classList.add("dark");
                }
                else{
                    document.documentElement.classList.remove("dark");
                }
            }
        }),
        {
            name: "theme-storage",
        }
    )
)