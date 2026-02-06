import { useThemeStore } from "@/stores/useThemeStore";
import { PopoverTrigger,Popover, PopoverContent } from "../ui/popover";
import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
interface EmojiPickerProp{
    onChange: (value:string)=> void;
}

const EmojiPicker = ({onChange}:EmojiPickerProp) => {
  const {isDark} = useThemeStore();

  return (
    <Popover>
        <PopoverTrigger className="cursor-pointer">
            <Smile className="size-4"/>
        </PopoverTrigger>
        <PopoverContent side="right" sideOffset={40} className="bg-transparent border-none shadow-none drop-shadow-none mb-12">
            {/*eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Picker theme={isDark?"dark":"light"} data={data} onEmojiSelect={(emoji:any)=>onChange(emoji.native)} emojiSize={24}/>
        </PopoverContent>
    </Popover>
  )
}

export default EmojiPicker