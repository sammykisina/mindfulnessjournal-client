import { cn } from '@/lib/utils';
import { Image, Text, View } from 'react-native';

/**
 * TYPES
 */
type TabIconProps = {
  color: string;
  focused: boolean;
  icon: any;
  name: string;
};

export const TabIcon: React.FC<TabIconProps> = ({
  color,
  focused,
  icon,
  name,
}) => {
  return (
    <View className='flex flex-col items-center justify-center gap-2 '>
      <Image
        source={icon}
        resizeMode='contain'
        tintColor={color}
        className='w-7 h-7'
      />

      <Text
        className={cn(
          'text-base',
          focused ? 'font-outfitsemibold' : 'font--outfitregular'
        )}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};
