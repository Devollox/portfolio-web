declare module 'cmdk' {
  const Command: any
  const CommandInput: any
  const CommandList: any
  const CommandGroup: any
  const CommandItem: any
  function useCommand(...args: any[]): any
  function usePages(...args: any[]): any

  export {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    useCommand,
    usePages
  }
}
