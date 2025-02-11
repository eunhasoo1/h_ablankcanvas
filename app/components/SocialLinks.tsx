import { Instagram, Youtube, Coffee } from 'lucide-react';
import Link from 'next/link';

const SocialLinks = () => {
  const links = [
    {
      id: '1',
      title: 'YouTube',
      url: 'https://www.youtube.com/@ABlankCanvas_Data',
      icon: <Youtube size={20} className="flex-shrink-0" />
    },
    {
      id: '2',
      title: 'Instagram',
      url: 'https://www.instagram.com/h_ablankcanvas/',
      icon: <Instagram size={20} className="flex-shrink-0" />
    },
    {
      id: '3',
      title: 'BANANA',
      url: 'https://buymeacoffee.com/kingbob',
      icon: <Coffee size={20} className="flex-shrink-0" />
    },
  ];

  return (
    <div className="relative px-1 w-fit self-start mb-3">
      <div className={`
        relative 
        max-w-[255px] 
        leading-6
        px-3 
        py-2
        rounded-[25px]
        bg-[#E5E5EA]
        text-[#282828]
        before:content-['']
        before:absolute
        before:bottom-0
        before:h-[16px]
        before:w-[12px]
        before:left-[-5px]
        before:bg-[#E5E5EA]
        before:[border-bottom-right-radius:20px_12px]
        after:content-['']
        after:absolute
        after:bottom-0
        after:h-[16px]
        after:w-[18px]
        after:bg-white
        after:left-[-18px]
        after:[border-bottom-right-radius:8px]
        font-['Helvetica_Neue',Helvetica,sans-serif]
      `}>
        <div className="flex flex-col gap-2 relative z-[1]">
          {links.map((item) => (
            <Link 
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
            >
              <div className="flex items-center gap-2">
                {/* {item.icon} */}
                <span className="text-[15px] underline">{item.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialLinks; 