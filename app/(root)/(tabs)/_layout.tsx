import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Icon, Label, NativeTabs, VectorIcon } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        {/* Use standard Android drawables, or use src={require('./path/to/img.png')} */}
        <Icon sf="house.fill"
         androidSrc={<VectorIcon family={MaterialCommunityIcons} name="home" />} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="search">
        <Icon sf="magnifyingglass"
         androidSrc={<VectorIcon family={MaterialCommunityIcons} name="magnify" />} />
        <Label>Search</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="saved">
        <Icon
          sf="heart.fill"
          androidSrc={<VectorIcon family={MaterialCommunityIcons} name="heart" />}
        />
        <Label>Saved</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Icon
          sf="person.fill"
          androidSrc={<VectorIcon family={MaterialCommunityIcons} name="account" />}
        />
          <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
