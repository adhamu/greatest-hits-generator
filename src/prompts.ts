import { multiselect, select, text } from '@clack/prompts'

export const textPrompt = (
  message: string,
  validationMessage?: string,
  initialValue?: string
) =>
  text({
    message,
    ...(validationMessage && {
      validate(value) {
        return !value ? validationMessage : undefined
      },
    }),
    ...(initialValue && { initialValue }),
  }) as Promise<string>

export const selectPrompt = <T extends string[]>(
  message: string,
  selectOptions: [...T],
  isMultiSelect = false
) => {
  const type = isMultiSelect ? multiselect : select

  return type({
    message,
    ...(isMultiSelect && { required: false }),
    options: selectOptions.map(option => ({
      value: option,
      label: option,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as any,
  }) as Promise<T extends Array<infer U> ? U : never>
}
