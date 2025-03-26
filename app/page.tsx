"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher, formatNumber } from "@/lib/utils";
import { LogoutLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogOut, Pen, Trash } from 'lucide-react';
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSwr from 'swr';

type Expense = {
  id: string,
  description: string,
  amount: number,
  userId: string
}

type DataFetch = {
  expenses: Expense[],
  totalAmount: number
}

type User = { id?: string, email?: string, family_name?: string, given_name?: string, picture?: string }

export default function Home() {
  const { register, handleSubmit, reset } = useForm<Expense>()
  const { user } = useKindeBrowserClient() as { user: User }

  const { data, isLoading, mutate } = useSwr<DataFetch>(
    user?.id ? '/api/expenses' : '',
    (url: string) => fetcher(url, { headers: { 'userid': user.id! } })
  )

  const submitData = async (data: Expense) => {
    toast("please wait...")
    await fetcher('/api/expenses', { body: JSON.stringify(data), method: 'post', headers: { 'userid': user?.id ?? "" } })
    await mutate()
    reset();
  }

  const deleteData = async (id: string) => {
    toast("please wait...")
    await fetcher('/api/expenses', { body: JSON.stringify({ id }), method: 'delete', headers: { 'userid': user?.id ?? "" } })
    await mutate()
  }

  const editData = async (data: Expense) => {
    toast("please wait...")
    await fetcher('/api/expenses', { body: JSON.stringify(data), method: 'put', headers: { 'userid': user?.id ?? "" } })
    await mutate()
  }


  return (
    <>
      <div>
        <header className="fixed top-4 left-4">
          {
            user && <>
              <LogoutLink><LogOut size={20} /></LogoutLink>
              <p className="my-1">Welcome {user?.given_name}</p>
            </>
          }
        </header>
        <div className="flex justify-center items-center h-screen flex-col">
          <Card className="w-96"> {/* Fixed width of 24rem */}
            <CardHeader>
              <CardTitle>Expense Tracker</CardTitle>
              <CardDescription>Track your expense for better saving plan</CardDescription>
            </CardHeader>
            <CardContent>
              Total: {isLoading ? '0' : formatNumber(data?.totalAmount ?? 0)}
            </CardContent>
          </Card>

          <div className="mt-8">
            {
              isLoading
                ? <Skeleton className="h-4 w-[250px]" />
                : <ScrollArea className="h-72 w-96 rounded-md border">
                  {data?.expenses?.map((expense) => (
                    <div key={expense.id} className="mb-4 w-96 text-sm flex justify-between p-4 border-b-1 border-b-slate-800">
                      <div>
                        <p>{expense.description}</p>
                        <p className="text-slate-400">Amount: {formatNumber(expense.amount)}</p>
                      </div>
                      <div className="gap-x-1 flex">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size={'icon'} variant={'outline'}><Pen /></Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Expense</DialogTitle>
                            </DialogHeader>
                            <form className="flex flex-col gap-y-6" onSubmit={handleSubmit(editData)}>
                              <div className="flex flex-col gap-y-2">
                                <Label>Description</Label>
                                <Input {...register("description")} placeholder="description" defaultValue={expense.description} />
                              </div>
                              <div className="flex flex-col gap-y-2">
                                <Label>Amount</Label>
                                <Input {...register("amount")} type="number" placeholder="amount" defaultValue={expense.amount} />
                              </div>
                              <Input hidden {...register("id")} defaultValue={expense.id} />
                              <Input hidden {...register("userId")} defaultValue={user?.id} />
                              <DialogTrigger asChild>
                                <Button type="submit">Submit</Button>
                              </DialogTrigger>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button size={'icon'} variant={'outline'} onClick={() => deleteData(expense.id)}><Trash /></Button>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
            }
          </div>
        </div>


        <Dialog>
          <DialogTrigger asChild>
            {user &&
              <Button variant={'ghost'} className="fixed bottom-4 right-4"><Pen /></Button>
            }
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Expense</DialogTitle>
            </DialogHeader>
            <form className="flex flex-col gap-y-6" onSubmit={handleSubmit(submitData)}>
              <div className="flex flex-col gap-y-2">
                <Label>Description</Label>
                <Input {...register("description")} placeholder="description" />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label>Amount</Label>
                <Input {...register("amount")} type="number" placeholder="amount" />
              </div>
              <Input hidden {...register("userId")} defaultValue={user?.id} />
              <DialogTrigger asChild>
                <Button type="submit">Submit</Button>
              </DialogTrigger>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}