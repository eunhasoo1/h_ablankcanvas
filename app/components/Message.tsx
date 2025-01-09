interface MessageProps {
  text: string;
  type?: 'send' | 'receive';
  showTail?: boolean;
}

export default function Message({ text, type = 'receive', showTail = true }: MessageProps) {
  return (
    <div className={`relative px-1 w-fit ${type === 'send' ? 'self-end mb-0' : `self-start ${showTail ? 'mb-3' : 'mb-1'}`}`}>
      <div className={`
        relative 
        max-w-[255px] 
        leading-6
        px-3 
        py-1 
        rounded-[25px]
        ${type === 'send' 
          ? 'bg-[#0B93F6] text-white' 
          : 'bg-[#E5E5EA] text-[#282828]'
        }

        ${showTail ? `
          before:content-['']
          before:absolute
          before:bottom-0
          before:h-[16px]
          before:w-[12px]
          ${type === 'send'
            ? `before:right-[-5px]
               before:bg-[#0B93F6]
               before:[border-bottom-left-radius:14px_12px]`
            : `before:left-[-5px]
               before:bg-[#E5E5EA]
               before:[border-bottom-right-radius:20px_12px]`
          }

          after:content-['']
          after:absolute
          after:bottom-0
          after:h-[16px]
          after:w-[18px]
          after:bg-white
          dark:after:bg-black
          ${type === 'send'
            ? `after:right-[-18px]
               after:[border-bottom-left-radius:8px]`
            : `after:left-[-18px]
               after:[border-bottom-right-radius:8px]`
          }
        ` : ''}

        font-['Helvetica_Neue',Helvetica,sans-serif]
      `}>
        <span className="text-sm font-normal relative z-[1]">
          {text}
        </span>
      </div>
    </div>
  );
} 