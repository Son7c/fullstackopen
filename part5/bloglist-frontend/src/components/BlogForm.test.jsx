import { getByText, render,screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import BlogForm from "./BlogForm"

test('<BlogForm /> updates parent state and calls onSubmit',async()=>{
    const user=userEvent.setup()
    const createBlog=vi.fn()

    render(<BlogForm handleCreateBlog={createBlog}/>)

    const title=screen.getByLabelText('title:')
    const author=screen.getByLabelText('author:')
    const url=screen.getByLabelText('url:')
    const btn=screen.getByText('Create')

    //Simulate Typing

    await user.type(title,'Testing from console')
    await user.type(author,'Souvik from console')
    await user.type(url,'https://www.google.com')

    await user.click(btn)

    console.log(createBlog.mock.calls)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Testing from console')
    expect(createBlog.mock.calls[0][0].author).toBe('Souvik from console')
    expect(createBlog.mock.calls[0][0].url).toBe('https://www.google.com')
})