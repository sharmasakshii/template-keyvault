export const isPermissionChecked = (data: any, identifier: any) => {
  for (let item of data) {
    if (item.slug === identifier) {
      return item;
    }
    if (item?.child?.length > 0) {
      let childChecked: any = isPermissionChecked(item.child, identifier);
      if (childChecked) {
        return childChecked;
      }
    }
  }
  return false;
};