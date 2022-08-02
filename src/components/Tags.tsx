import React from 'react'
import {
  Tag,
  VerifiedIcon,
  TagProps
} from '@pancakeswap/uikit'

const CoreTag: React.FC<TagProps> = (props) => {
  return (
    <Tag variant="secondary" outline startIcon={<VerifiedIcon width="18px" color="secondary"/>} {...props}>
      {'Core'}
    </Tag>
  )
}
export { CoreTag};
