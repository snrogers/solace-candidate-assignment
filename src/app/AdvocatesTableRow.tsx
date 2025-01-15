import { Advocate } from "@/db/schema"
import { FC } from "react"

type AdvocatesTableRowProps = {
  advocate: Advocate
}

const AdvocatesTableRow: FC<AdvocatesTableRowProps> = (props) => {
  const { advocate } = props
  const {
    city,
    degree,
    firstName,
    lastName,
    phoneNumber,
    yearsOfExperience,
  } = advocate

  // PARANOIA: Deduping specialties to guard against
  //           duplicating our keys in the JSX
  const uniqueSpecialties = advocate.specialties.reduce(
    (acc, curr) => {
      if (acc.includes(curr)) return acc
      else return [...acc, curr]
    },
    [] as string[]
  )

  return (
    <tr className="even:bg-muted hover:bg-muted/80 transition-colors">
      <td className="p-4">{advocate.firstName}</td>
      <td className="p-4">{advocate.lastName}</td>
      <td className="p-4">{advocate.city}</td>
      <td className="p-4">{advocate.degree}</td>
      <td className="p-4">
        {uniqueSpecialties.map((s, idx) => {
          return <div key={s}>{s}</div>
        })}
      </td>
      <td className="p-4">{advocate.yearsOfExperience}</td>
      <td className="p-4">{advocate.phoneNumber}</td>
    </tr>
  )
}

export default AdvocatesTableRow
