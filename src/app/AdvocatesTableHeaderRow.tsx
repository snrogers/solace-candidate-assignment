import { FC } from "react"


const AdvocatesTableHeaderRow: FC = (props) => {
  return (
    <tr>
      <th className="p-4 text-left font-medium">First Name</th>
      <th className="p-4 text-left font-medium">Last Name</th>
      <th className="p-4 text-left font-medium">City</th>
      <th className="p-4 text-left font-medium">Degree</th>
      <th className="p-4 text-left font-medium">Specialties</th>
      <th className="p-4 text-left font-medium">Years of Experience</th>
      <th className="p-4 text-left font-medium">Phone Number</th>
    </tr>
  )
}

export default AdvocatesTableHeaderRow
